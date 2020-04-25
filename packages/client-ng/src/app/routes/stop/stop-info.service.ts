/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopLocation, IStopPassage } from '@manniwatch/api-types';
import { interval, Observable } from 'rxjs';
import { flatMap, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService, StopPointService } from 'src/app/services';

export interface IStatus {
    lastUpdate: Date;
    location?: IStopLocation;
    stop: IStopPassage;
}
@Injectable()
export class StopInfoService {
    public stopInfoObservable: Observable<IStopPassage>;
    constructor(private route: ActivatedRoute,
        private apiService: ApiService,
        private stopService: StopPointService) {
        this.stopInfoObservable = this.route.data
            .pipe(map((data: any): IStopPassage =>
                data.stopInfo));
    }

    public createStopLocationObservable(): Observable<IStopLocation> {
        return this.stopInfoObservable
            .pipe(flatMap((value: IStopPassage): Observable<IStopLocation> => {
                return this.stopService.filterStop(value.stopShortName);
            }));
    }

    public createStopPassageRefreshObservable(): Observable<IStopPassage> {
        return this.stopInfoObservable
            .pipe(switchMap((value: IStopPassage): Observable<IStopPassage> => {
                return interval(5000)
                    .pipe(switchMap((): Observable<IStopPassage> =>
                        this.apiService
                            .getStopPassages(value.stopShortName)),
                        startWith(value));
            }));
    }
}
