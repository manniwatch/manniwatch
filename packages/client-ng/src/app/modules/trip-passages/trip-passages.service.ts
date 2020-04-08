/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { ITripPassages } from '@manniwatch/api-types';
import { ApiService } from 'core';
import { merge, timer, BehaviorSubject, Observable, Subject } from 'rxjs';
import { flatMap, map, scan, switchMap, take, tap } from 'rxjs/operators';
import { IPassageStatus, TripPassagesUtil, UpdateStatus } from './trip-util';

@Injectable()
export class TripPassagesService {
    public readonly statusObservable: Observable<IPassageStatus>;
    private readonly statusSubject: BehaviorSubject<IPassageStatus>;
    constructor(private route: ActivatedRoute,
        private apiService: ApiService) {
        this.statusSubject = new BehaviorSubject(route.snapshot.data.tripPassages);
        this.statusObservable = this.createStatusObservable(this.statusSubject);
    }

    public createStatusObservable(statusSubject: Subject<IPassageStatus>): Observable<IPassageStatus> {
        const refreshObservable: Observable<IPassageStatus> = this.createRefreshPollObservable(statusSubject);
        return merge(this.route.data.pipe(map((data: Data): ITripPassages => data.tripPassages)), refreshObservable)
            .pipe(scan((acc: IPassageStatus, val: IPassageStatus, idx: number): IPassageStatus => {
                if (val.failures > 0) {
                    const newVal: IPassageStatus = Object.assign({}, val);
                    newVal.failures = val.failures + acc.failures;
                    return newVal;
                }
                return val;
            }),
                tap((newStatus: IPassageStatus): void => statusSubject.next(newStatus)));
    }

    public createRefreshPollObservable(statusSubject: Subject<IPassageStatus>): Observable<IPassageStatus> {
        return statusSubject.pipe(
            switchMap((status: IPassageStatus): Observable<IPassageStatus> => {
                const refreshDelay: number = (status.status === UpdateStatus.LOADED) ?
                    10000 :
                    20000;
                return this.createDelayedPassageRequest(status.tripId, refreshDelay);
            }));
    }

    public createDelayedPassageRequest(tripId: string, refreshDelay: number): Observable<IPassageStatus> {
        return timer(refreshDelay)
            .pipe(take(1),
                flatMap((): Observable<ITripPassages> => this.apiService.getTripPassages(tripId)),
                TripPassagesUtil.convertResponse(tripId),
                TripPassagesUtil.handleError(tripId));
    }

}
