/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { IVehicleLocationList } from '@manniwatch/api-types';
import { iif, of, timer, Observable, Subscriber, TeardownLogic } from 'rxjs';
import { flatMap, repeat, tap } from 'rxjs/operators';

export type CallMethod = (lastUpdate: number) => Observable<IVehicleLocationList>;
export const intervalPoll: (queryDataObservable: CallMethod, queryDelay?: number) => Observable<IVehicleLocationList> =
    (queryDataObservable: CallMethod, queryDelay: number = 10000): Observable<IVehicleLocationList> => {
        return new Observable<IVehicleLocationList>((subscriber: Subscriber<IVehicleLocationList>): TeardownLogic => {
            let lastUpdateTimestamp: number = 0;
            let first: boolean = true;
            return iif((): boolean => {
                if (!first) {
                    return false;
                }
                first = false;
                return true;
            }, of(0), timer(queryDelay))
                .pipe(flatMap((): Observable<IVehicleLocationList> => {
                    return queryDataObservable(lastUpdateTimestamp);
                }),
                    tap((response: IVehicleLocationList): void => { lastUpdateTimestamp = response.lastUpdate; }),
                    repeat())
                .subscribe({
                    complete: (): void => {
                        subscriber.complete();
                    },
                    error: (err: any): void => {
                        subscriber.error(err);
                    },
                    next: (value: any): void => {
                        subscriber.next(value);
                    },
                });
        });
    };
