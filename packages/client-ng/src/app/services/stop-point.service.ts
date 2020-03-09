/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
import { from, Observable, Subject, Subscriber } from 'rxjs';
import { catchError, delay, filter, flatMap, map, shareReplay, startWith, tap } from 'rxjs/operators';
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

    private mStopLocations: IStopLocation[];
    private sharedReplay: Observable<IStopLocation[]> = undefined;
    private retrySubject: Subject<void> = new Subject();
    constructor(private api: ApiService, private notificationService: AppNotificationService) { }

    public createStopLoadObservable(): Observable<IStopLocation[]> {
        return this.retrySubject.pipe(delay(10 * 1000))
            .pipe(
                // tslint:disable-next-line:deprecation
                startWith<void>(undefined),
                flatMap((): Observable<IStopLocation[]> =>
                    this.api.getStations()
                        .pipe(
                            map((value): IStopLocation[] =>
                                value.stops),
                            catchError((err: any, caught: Observable<IStopLocation[]>): Observable<IStopLocation[]> => {
                                this.notificationService.report(err);
                                this.retrySubject.next();
                                return from([[]]);
                            }))),
                tap((value: IStopLocation[]) => {
                    this.mStopLocations = value;
                }),
                catchError((err) =>
                    from([[]])),
                shareReplay(1));
    }

    public get stopLocations(): IStopLocation[] {
        return this.mStopLocations ? this.mStopLocations : [];
    }

    /**
     * retrieves the stop or undefined if not loaded yet or undefined
     * @param stopShortName short name
     */
    public getStopLocation(stopShortName: string): IStopLocation {
        for (const stop of this.stopLocations) {
            if (stop.shortName === stopShortName) {
                return stop;
            }
        }
        return undefined;
    }

    /**
     * Searches the stops for a given stopShortName
     * @param stopShortName the stop shortName
     */
    public searchStop(stopShortName: string): Observable<IStopLocation> {
        return this.stopLocationsObservable
            .pipe(
                flatMap((stops: IStopLocation[]): Observable<IStopLocation> =>
                    from(stops)),
                filter((stop: IStopLocation) => {
                    if (stop) {
                        return stop.shortName === stopShortName;
                    }
                    return false;
                }));
    }

    /**
     * Gets the shared stop location observable
     */
    public get stopLocationsObservable(): Observable<IStopLocation[]> {
        if (this.sharedReplay === undefined) {
            this.sharedReplay = this.createStopLoadObservable();
        }
        return this.sharedReplay;
    }

}
