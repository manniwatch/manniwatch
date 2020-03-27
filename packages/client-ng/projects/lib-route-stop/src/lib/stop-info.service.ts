/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopLocation, IStopPassage } from '@manniwatch/api-types';
import { ApiService, StopPointService } from 'core';
import { combineLatest, from, interval, Observable } from 'rxjs';
import { first, flatMap, map, startWith, switchMap } from 'rxjs/operators';

export interface IStatus {
    lastUpdate: Date;
    location?: IStopLocation;
    stop: IStopPassage;
}
@Injectable()
export class StopInfoService {
    public readonly statusObservable: Observable<IStatus>;
    constructor(private route: ActivatedRoute,
        private apiService: ApiService,
        private stopService: StopPointService) {
        const stopFromResolver: Observable<IStopPassage> = this.route.data
            .pipe(map((data: any): IStopPassage =>
                data.stopInfo));
        this.statusObservable = stopFromResolver
            .pipe(switchMap((stopPassage: IStopPassage): Observable<IStatus> => {
                const passageRefreshObservable: Observable<IStatus> = this
                    .createStopPassageRefreshObservable(stopPassage);
                const locationObservable: Observable<IStopLocation> = this
                    .createStopLocationObservable(stopPassage);

                return combineLatest([passageRefreshObservable, locationObservable])
                    .pipe(map((mapValue: [IStatus, IStopLocation]): IStatus => Object.assign(mapValue[0], {
                        location: mapValue[1],
                    })));
            }));
    }

    public createStopLocationObservable(stopPassage: IStopPassage): Observable<IStopLocation> {
        return this.stopService
            .stopObservable
            .pipe(flatMap((stopLocations: IStopLocation[]): Observable<IStopLocation> =>
                from(stopLocations)
                    .pipe(first((stopLocation: IStopLocation): boolean =>
                        (stopLocation && stopLocation.shortName === stopPassage.stopShortName), undefined))));
    }

    public createStopPassageRefreshObservable(initStopPassage: IStopPassage): Observable<IStatus> {
        return interval(5000)
            .pipe(switchMap((): Observable<IStopPassage> =>
                this.apiService
                    .getStopPassages(initStopPassage.stopShortName as any)),
                startWith(initStopPassage),
                map((stopPassage: IStopPassage): IStatus =>
                    ({
                        lastUpdate: new Date(),
                        stop: stopPassage,
                    })),
            );
    }
}
