import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopLocation, IStopPassage, StopId } from '@donmahallem/trapeze-api-types';
import { combineLatest, from, merge, timer, Observable, Subscription } from 'rxjs';
import { catchError, filter, flatMap, map } from 'rxjs/operators';
import { StopPointService } from 'src/app/services/stop-point.service';
import { ApiService } from '../../services';
@Component({
    selector: 'app-stop-info',
    styleUrls: ['./stop-info.component.scss'],
    templateUrl: './stop-info.component.pug',
})
export class StopInfoComponent implements AfterViewInit, OnDestroy {

    public get timeUntilRefresh(): number {
        return this.mTimeUntilRefresh;
    }
    public get stopId(): string {
        return this.route.snapshot.params.stopId;
    }

    public get stopInfo(): IStopPassage {
        return this.mStopInfo;
    }
    public routes: any[] = [];
    public errorOccured = false;
    public readonly ticksToRefresh: number = 50;
    /**
     * Tick interval in miliseconds
     */
    public readonly tickInterval: number = 200;

    /**
     * The stop location.
     * Can be undefined or an instance of {@link IStopLocation}
     */
    public stopLocation: IStopLocation = undefined;
    /**
     * Subscription for the update Observable
     */
    private updateSubscription: Subscription;
    /**
     * The timer overservable dictating the update interval
     */
    private mTimerObservable: Observable<number>;
    private mTimeUntilRefresh = 0;
    private mStopInfo: IStopPassage;

    constructor(private route: ActivatedRoute, private apiService: ApiService,
                private stopService: StopPointService) {
        this.mStopInfo = this.route.snapshot.data.stopInfo;
    }

    /**
     * Converts the time to a human readable format
     * @param time time
     * @param data data
     */
    public convertTime(time, data) {
        if (time > 300) {
            return data.actualTime;
        } else {
            return Math.ceil(time / 60) + 'min';
        }
    }
    public ngAfterViewInit(): void {
        this.mTimerObservable = timer(this.tickInterval, this.tickInterval);
        this.mTimerObservable.subscribe((tick: number) => {
            const ticksLeft: number = this.ticksToRefresh - (tick % this.ticksToRefresh);
            const diff: number = Math.round((ticksLeft * this.tickInterval) / 1000);
            if (diff !== this.mTimeUntilRefresh) {
                this.mTimeUntilRefresh = diff;
            }
        });
        const stopIdObvservable: Observable<string> = this.route.params
            .pipe(map((a: { stopId: string }): string => a.stopId));
        stopIdObvservable.pipe(map((id: string) =>
            this.stopService.getStopLocation(id)))
            .subscribe((stop) => {
                this.stopLocation = stop;
            });
        const refreshObservable = combineLatest([this.mTimerObservable.pipe(filter((val: number) =>
            val % this.ticksToRefresh === 0 && val > 0)), stopIdObvservable])
            .pipe(
                map((a): string => a[1]),
                flatMap((stopId: StopId): Observable<IStopPassage> =>
                    this.apiService.getStopPassages(stopId)),
                catchError((err, a) => {
                    this.errorOccured = true;
                    return from([undefined]);
                }),
                filter((item: IStopPassage) =>
                    item !== undefined));
        /**
         * combine observables
         */
        this.updateSubscription = merge<IStopPassage, IStopPassage>(refreshObservable, this.route.data.pipe(map((value) =>
            value.stopInfo)))
            .subscribe(this.updateData.bind(this));
    }

    public ngOnDestroy(): void {
        this.updateSubscription.unsubscribe();
    }
    private updateData(data: IStopPassage): void {
        this.errorOccured = false;
        if ((data as any).stopShortName === this.stopId) {
            this.mStopInfo = data;
        }
    }

}
