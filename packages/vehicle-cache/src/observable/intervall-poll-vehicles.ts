/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { IVehicleLocationList } from '@manniwatch/api-types';
import { concat, of, Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { convertPollResult, PollResult } from '../operators';

export type QueryFactory = (lastUpdate: number) => Observable<IVehicleLocationList>;
export const intervallPollVehicles = (queryFactory: QueryFactory, refreshInterval: number = 60000): Observable<PollResult> => {
    return new Observable<PollResult>((subscriber: Subscriber<PollResult>): Subscription => {
        const updateSubject: Subject<number> = new Subject<number>();
        return concat(of(0), updateSubject.pipe(delay(refreshInterval)))
            .pipe(switchMap((timestamp: number): Observable<PollResult> => {
                let lastUpdate: number = timestamp;
                return queryFactory(timestamp)
                    .pipe(tap({
                        complete: (): void => {
                            updateSubject.next(lastUpdate);
                        },
                        error: (): void => {
                            updateSubject.next(lastUpdate);
                        },
                        next: (locs: IVehicleLocationList): void => {
                            lastUpdate = locs.lastUpdate;
                        },
                    }), convertPollResult());
            }))
            .subscribe(subscriber);
    });
};
