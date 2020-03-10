import { Injectable } from '@angular/core';
import { IStopLocation, IStopLocations, IStopPointLocation, IStopPointLocations, StopShortName } from '@donmahallem/trapeze-api-types';
import { Observable, Subscriber } from 'rxjs';
import { debounceTime, map, retryWhen, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AppNotificationService } from './app-notification.service';

export class StopPointLoadSubscriber extends Subscriber<IStopLocation[]> {

    public constructor(private service: StopPointService) {
        super();
    }

    public next(stops: IStopLocation[]): void {
        (this.service as any).mStopLocations = stops;
    }

    public error(err: any): void {
    }

    public complete(): void {
    }
}

/**
 * Service for caching and retrieving Stop Locations
 */
@Injectable({
    providedIn: 'root',
})
export class StopPointService {

    private mStopPointObservable: Observable<IStopPointLocation[]>;
    private mStopObservable: Observable<IStopLocation[]>;
    constructor(private api: ApiService,
                private notificationService: AppNotificationService) {
        this.mStopObservable = this.setupLocationsPoll(this.api.getStopLocations()
            .pipe(map((stops: IStopLocations): IStopLocation[] =>
                stops.stops)));
        this.mStopPointObservable = this.setupLocationsPoll(this.api.getStopPointLocations()
            .pipe(map((stops: IStopPointLocations): IStopPointLocation[] =>
                stops.stopPoints)));
    }

    public setupLocationsPoll<T extends IStopLocation | IStopPointLocation>(pollObservable: Observable<T[]>): Observable<T[]> {
        return pollObservable
            .pipe(retryWhen((errors: Observable<any>): Observable<any> =>
                errors
                    .pipe(tap((err: any) => this.notificationService.report(err)),
                        debounceTime(5000))), shareReplay(1));
    }

    public filterByObservable(filter: Observable<StopShortName>): Observable<IStopLocation> {
        return this.stopObservable
            .pipe(withLatestFrom(filter),
                map((value: [IStopLocation[], StopShortName]): IStopLocation => {
                    if (value[0] && value[1]) {
                        const idx: number = value[0].findIndex((stop: IStopLocation) =>
                            stop.shortName === value[1]);
                        if (idx >= 0) {
                            return value[0][idx];
                        }
                    }
                    return undefined;
                }));
    }
    public filterStop(stopShortName: StopShortName): Observable<IStopLocation> {
        return this.stopObservable
            .pipe(map((stopLocations: IStopLocation[]): IStopLocation => {
                if (stopLocations) {
                    const idx: number = stopLocations.findIndex((stop: IStopLocation) =>
                        stop.shortName === stopShortName);
                    if (idx >= 0) {
                        return stopLocations[idx];
                    }
                }
                return undefined;
            }));
    }

    public get stopObservable(): Observable<IStopLocation[]> {
        return this.mStopObservable;
    }

    public get stopPointObservable(): Observable<IStopPointLocation[]> {
        return this.mStopPointObservable;
    }

}
