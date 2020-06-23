/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable, ApplicationRef } from '@angular/core';
import { IStopLocation, IStopLocations, IStopPointLocation, IStopPointLocations } from '@manniwatch/api-types';
import { from, of, Observable, combineLatest } from 'rxjs';
import { map, shareReplay, withLatestFrom, flatMap, first, startWith, catchError, filter } from 'rxjs/operators';
import { ApiService } from './api.service';
import { StopsDb } from './stops-db';

export interface IMinMax { min: number; max: number; };
export enum LoadStatus {
    LOADING = 0,
    ERROR = 1,
    SUCCESS = 2,
}
export interface IInitStatus {
    stopsLoaded: LoadStatus;
    stopPointsLoaded: LoadStatus;
}
/**
 * Service for caching and retrieving Stop Locations
 */
@Injectable({
    providedIn: 'root',
})
export class StopPointService {

    public readonly statusObservable: Observable<IInitStatus>;
    public readonly statusStopObservable: Observable<true>;
    public stopsDb: StopsDb;
    constructor(private api: ApiService,
        private appRef: ApplicationRef) {
        this.stopsDb = new StopsDb();
        this.statusObservable = this.appRef
            .isStable
            .pipe(flatMap((stable: boolean): Observable<IInitStatus> => {
                const primeObservable = (obs: Observable<number>): Observable<LoadStatus> => {
                    return obs.pipe(map((): LoadStatus => LoadStatus.SUCCESS),
                        startWith(LoadStatus.LOADING),
                        catchError((err: any): Observable<LoadStatus> => {
                            return of(LoadStatus.ERROR);
                        }));
                };
                const stops: Observable<LoadStatus> = primeObservable(this.populateStopsIfEmpty());
                const stopPoints: Observable<LoadStatus> = primeObservable(this.populateStopPointsIfEmpty());
                return combineLatest([stops, stopPoints])
                    .pipe(map((statuses: [LoadStatus, LoadStatus]): IInitStatus => {
                        return {
                            stopPointsLoaded: statuses[1],
                            stopsLoaded: statuses[0],
                        };
                    }));
            }), shareReplay(1));
        this.statusStopObservable = this.statusObservable
            .pipe(filter((status: IInitStatus): boolean => {
                return status.stopsLoaded === LoadStatus.SUCCESS;
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

    public refreshStopTable(): Observable<number> {
        return this.api
            .getStopLocations()
            .pipe(map((stopList: IStopLocations): IStopLocation[] => {
                return stopList.stops;
            }),
                flatMap((stops: IStopLocation[]): Observable<number> => {
                    return this.updateStopDatabaseEntries(stops);
                }));
    }

    public populateStopsIfEmpty(): Observable<number> {
        return this.getStopCount()
            .pipe(flatMap((stopCount: number): Observable<number> => {
                if (stopCount > 0) {
                    return of(stopCount);
                } else {
                    return this.refreshStopTable();
                }
            }));
    }

    public populateStopPointsIfEmpty(): Observable<number> {
        return this.getStopPointCount()
            .pipe(flatMap((stopCount: number): Observable<number> => {
                if (stopCount > 0) {
                    return of(stopCount);
                } else {
                    return this.refreshStopPointTable();
                }
            }));
    }

    public refreshStopPointTable(): Observable<number> {
        return this.api
            .getStopPointLocations()
            .pipe(map((stopList: IStopPointLocations): IStopPointLocation[] => {
                return stopList.stopPoints;
            }),
                flatMap((stops: IStopPointLocation[]): Observable<number> => {
                    return this.updateStopPointDatabaseEntries(stops);
                }));
    }

    /**
     *
     * @param stops stops to update in the database
     * @returns Number of updated stops
     */
    public updateStopDatabaseEntries(stops: IStopLocation[]): Observable<number> {
        return from(this.stopsDb.transaction('rw', this.stopsDb.stopLocations, async (): Promise<number> => {
            await this.stopsDb.stopLocations.clear();
            await this.stopsDb.stopLocations.bulkPut(stops);
            return stops.length;
        }));
    }

    /**
     *
     * @param stops stops to update in the database
     * @returns Number of updated stops
     */
    public updateStopPointDatabaseEntries(stops: IStopPointLocation[]): Observable<number> {
        return from(this.stopsDb.transaction('rw', this.stopsDb.stopPointLocations, async (): Promise<number> => {
            await this.stopsDb.stopPointLocations.clear();
            await this.stopsDb.stopPointLocations.bulkPut(stops);
            return stops.length;
        }));
    }

    public searchStop(searchPatterns: string[]): Observable<IStopLocation[]> {
        return this.mStopStatusObservable
            .pipe(flatMap((): Observable<IStopLocation[]> => {
                const query: Promise<IStopLocation[]> = this.stopsDb
                    .stopLocations
                    .where('search_keys')
                    .startsWithAnyOfIgnoreCase(searchPatterns)
                    .distinct()
                    .toArray();
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

}
