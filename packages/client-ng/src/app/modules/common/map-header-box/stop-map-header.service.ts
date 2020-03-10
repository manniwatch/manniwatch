/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { IStopLocation, IStopPassage, IStopPointLocation } from '@donmahallem/trapeze-api-types';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StopPointService } from 'src/app/services';

export type DisplayStop = IStopLocation | IStopPointLocation;
@Injectable()
export class StopMapHeaderService {
    public readonly stopPassageSubject: BehaviorSubject<IStopPassage> = new BehaviorSubject(undefined);
    constructor(public stopService: StopPointService) {
    }

    public createStopLocationObservable(): Observable<DisplayStop> {
        return this.pollStopLocation(this.stopPassageSubject);
    }
    public pollStopLocation(source: Observable<IStopPassage>): Observable<DisplayStop> {
        return source.pipe(switchMap((stopPassage: IStopPassage): Observable<DisplayStop> => {
            // tslint:disable-next-line:triple-equals
            if (stopPassage != undefined) {
                return this.stopService
                    .filterStop(stopPassage.stopShortName);
            }
            return of(undefined);
        }));
    }

}
