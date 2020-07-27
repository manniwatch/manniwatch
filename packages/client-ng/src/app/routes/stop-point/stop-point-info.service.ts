/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { ApplicationRef, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopPassage, IStopPointLocation } from '@manniwatch/api-types';
import { interval, Observable } from 'rxjs';
import { first, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { IStaticMapData } from 'src/app/modules/openlayers';
import { ApiService } from 'src/app/services';
import { StopPointService } from 'src/app/services';

export interface IStatus {
    location?: IStopPointLocation;
    passages: IStopPassage;
}
@Injectable()
export class StopPointInfoService {
    public readonly stopPassageObservable: Observable<IStopPassage>;
    constructor(private route: ActivatedRoute,
        private apiService: ApiService,
        public stopService: StopPointService,
        private appRef: ApplicationRef) {
        this.stopPassageObservable = this.route.data.pipe(map((params: any): IStopPassage => {
            return params.stopPoint;
        }));
    }
    public createStopPassageRefreshObservable(): Observable<IStopPassage> {
        return this.stopPassageObservable
            .pipe(switchMap((value: IStopPassage): Observable<IStopPassage> => {
                return this.appRef
                    .isStable.pipe(first((state: boolean): boolean => state),
                        mergeMap((): Observable<IStopPassage> => {
                            return interval(5000)
                                .pipe(switchMap((): Observable<IStopPassage> =>
                                    this.apiService
                                        .getStopPointPassages(value.stopShortName)));
                        }),
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
