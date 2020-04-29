/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IActualDeparture, IRoute, IStopPassage, IStopPointLocation } from '@manniwatch/api-types';
import { combineLatest, merge, timer, Observable, Subject, Observer, interval } from 'rxjs';
import { distinctUntilChanged, flatMap, map, shareReplay, switchMap, tap, startWith } from 'rxjs/operators';
import { ApiService } from 'src/app/services';
import { StopPointService } from 'src/app/services';
import { IStaticMapData } from 'src/app/modules/openlayers';
import { OlUtil } from 'src/app/util/ol';

export interface IStatus {
    location?: IStopPointLocation;
    passages: IStopPassage;
}
@Injectable()
export class StopPointInfoService {
    public readonly stopPassageObservable: Observable<IStopPassage>;
    constructor(private route: ActivatedRoute,
        private apiService: ApiService,
        public stopService: StopPointService) {
        this.stopPassageObservable = this.route.data.pipe(map((params: any): IStopPassage => {
            return params.stopPoint;
        }));
    }
    public createStopPassageRefreshObservable(): Observable<IStopPassage> {
        return this.stopPassageObservable
            .pipe(switchMap((value: IStopPassage): Observable<IStopPassage> => {
                return interval(5000)
                    .pipe(switchMap((): Observable<IStopPassage> =>
                        this.apiService
                            .getStopPointPassages(value.stopShortName)),
                        startWith(value));
            }));
    }

    public createStopPointLocationObservable(): Observable<IStaticMapData> {
        return this.stopPassageObservable
            .pipe(switchMap((stopPassage: IStopPassage): Observable<IStopPointLocation> => {
                return this.stopService.watchStopPoint(stopPassage.stopShortName)
                    .pipe(startWith<IStopPointLocation>(undefined as IStopPointLocation));
            }), map((stop: IStopPointLocation): IStaticMapData => {
                // tslint:disable-next-line:triple-equals
                if (stop == undefined) {
                    return { map: { blur: true } };
                } else {
                    return {
                        map: {
                            blur: false,
                            center: stop,
                        },
                    };
                }
            }));
    }
}
