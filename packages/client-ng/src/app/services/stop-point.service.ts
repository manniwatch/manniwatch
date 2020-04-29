/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { IStopLocation, IStopLocations, IStopPointLocation, IStopPointLocations } from '@manniwatch/api-types';
import { from, of, Observable, Subscriber } from 'rxjs';
import { debounceTime, map, retryWhen, shareReplay, tap, withLatestFrom, flatMap, first } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AppNotificationService } from './app-notification.service';
import { StopsDb } from './stops-db';

// tslint:disable:max-classes-per-file
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
export interface IMinMax { min: number; max: number; };
/**
 * Service for caching and retrieving Stop Locations
 */
@Injectable({
    providedIn: 'root',
})
export class StopPointService {

    private mStopPointObservable: Observable<IStopPointLocation[]>;
    private mStopObservable: Observable<IStopLocation[]>;
    private mStopStatusObservable: Observable<true>;
    private mStopPointStatusObservable: Observable<true>;
    public stopsDb: StopsDb;
    constructor(private api: ApiService,
        private notificationService: AppNotificationService) {
        this.stopsDb = new StopsDb();
        this.mStopStatusObservable = this.createStatusObservable(this.getStopCount(), this.refreshStopTable());
        this.mStopPointStatusObservable = this.createStatusObservable(this.getStopCount(), this.refreshStopPointTable());
        this.mStopObservable = this.mStopStatusObservable
            .pipe(flatMap((): Observable<IStopLocation[]> => {
                const queryStops: Promise<IStopLocation[]> = this.stopsDb
                    .stopLocations
                    .toArray();
                return from(queryStops);
            }));
        this.mStopPointObservable = this.mStopPointStatusObservable
            .pipe(flatMap((): Observable<IStopPointLocation[]> => {
                const queryStops: Promise<IStopPointLocation[]> = this.stopsDb
                    .stopPointLocations
                    .toArray();
                return from(queryStops);
            }));
    }

    public createStatusObservable(countObservable: Observable<number>,
        queryDataObservable: Observable<void>): Observable<true> {
        return countObservable
            .pipe(flatMap((stopCount: number): Observable<true> => {
                if (stopCount > 0) {
                    return of(true);
                } else {
                    return queryDataObservable
                        .pipe(map((): true => {
                            return true;
                        }));
                }
            }), first((status: true): true => status), shareReplay(1));
    }

    public getStopCount(): Observable<number> {
        const queryStopCount: Promise<number> = this.stopsDb.stopLocations.count();
        return from(queryStopCount);
    }

    public getStopPointCount(): Observable<number> {
        const queryStopCount: Promise<number> = this.stopsDb.stopPointLocations.count();
        return from(queryStopCount);
    }

    public getStopsInBox(longitude: IMinMax, latitude: IMinMax): Observable<IStopLocation[]> {
        const queryStops: Promise<IStopLocation[]> = this.stopsDb
            .stopLocations
            .where(['latitude', 'longitude'])
            .between([latitude.min, longitude.min], [latitude.max, longitude.max], true, true)
            .toArray();
        return from(queryStops);
    }

    public refreshStopTable(): Observable<void> {
        return this.api
            .getStopLocations()
            .pipe(map((stopList: IStopLocations): IStopLocation[] => {
                return stopList.stops;
            }),
                flatMap((stops: IStopLocation[]): Observable<void> => {
                    return this.updateStopDatabaseEntries(stops);
                }));
    }

    public refreshStopPointTable(): Observable<void> {
        return this.api
            .getStopPointLocations()
            .pipe(map((stopList: IStopPointLocations): IStopPointLocation[] => {
                return stopList.stopPoints;
            }),
                flatMap((stops: IStopPointLocation[]): Observable<void> => {
                    return this.updateStopPointDatabaseEntries(stops);
                }));
    }

    public updateStopDatabaseEntries(stops: IStopLocation[]): Observable<void> {
        return from(this.stopsDb.transaction('rw', this.stopsDb.stopLocations, async (): Promise<void> => {
            await this.stopsDb.stopLocations.clear();
            await this.stopsDb.stopLocations.bulkPut(stops);
        }));
    }

    public updateStopPointDatabaseEntries(stops: IStopPointLocation[]): Observable<void> {
        return from(this.stopsDb.transaction('rw', this.stopsDb.stopPointLocations, async (): Promise<void> => {
            await this.stopsDb.stopPointLocations.clear();
            await this.stopsDb.stopPointLocations.bulkPut(stops);
        }));
    }

    public searchStop(searchPattern: string): Observable<IStopLocation[]> {
        return this.mStopStatusObservable
            .pipe(flatMap((): Observable<IStopLocation[]> => {
                const query: Promise<IStopLocation[]> = this.stopsDb
                    .stopLocations
                    .filter((testStop: IStopLocation): boolean => {
                        return testStop.name.toLowerCase().includes(searchPattern);
                    }).toArray();
                return from(query);
            }));
    }

    public filterByObservable(filter: Observable<string>): Observable<IStopLocation> {
        return this.stopObservable
            .pipe(withLatestFrom(filter),
                map((value: [IStopLocation[], string]): IStopLocation => {
                    if (value[0] && value[1]) {
                        const idx: number = value[0].findIndex((stop: IStopLocation): boolean =>
                            stop.shortName === value[1]);
                        if (idx >= 0) {
                            return value[0][idx];
                        }
                    }
                    return undefined;
                }));
    }

    public filterStop(string: string): Observable<IStopLocation> {
        return this.stopObservable
            .pipe(map((stopLocations: IStopLocation[]): IStopLocation => {
                if (stopLocations) {
                    const idx: number = stopLocations.findIndex((stop: IStopLocation): boolean =>
                        stop.shortName === string);
                    if (idx >= 0) {
                        return stopLocations[idx];
                    }
                }
                return undefined;
            }));
    }

    public watchStopPoint(stopPointId: string): Observable<IStopPointLocation> {
        return this.stopPointObservable
            .pipe(map((stopLocations: IStopPointLocation[]): IStopPointLocation => {
                if (stopLocations) {
                    const idx: number = stopLocations.findIndex((stop: IStopPointLocation): boolean =>
                        stop.stopPoint === stopPointId);
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
