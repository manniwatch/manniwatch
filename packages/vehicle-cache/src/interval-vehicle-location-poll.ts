/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/vehicle-cache
*/

import { IVehicleLocationList, PositionType } from '@manniwatch/api-types';
import { concat, of, Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

export enum IPollEventType {
    UPDATE = 1,
    ERROR = 2,
}
export interface IPollEvent {
    type: IPollEventType;
}

export interface IPollUpdateEvent extends IPollEvent {
    type: IPollEventType.UPDATE;
    vehicles: IVehicleLocationList;
}
export interface IPollErrorEvent extends IPollEvent {
    error: any;
    type: IPollEventType.ERROR;
}
export type QueryFactory = (positionType: PositionType, timestamp: number) => Observable<IVehicleLocationList>;
/**
 * Constantly polls data from source
 *
 * @param queryFac factory method to create poll
 * @param refreshInterval delay between refreshes
 */
export const intervalVehicleLocationPoll: (queryFac: QueryFactory, refreshInterval: number) => Observable<IVehicleLocationList> =
    (queryFac: QueryFactory, refreshInterval: number = 60000): Observable<IVehicleLocationList> =>
        new Observable<IVehicleLocationList>((subscriber: Subscriber<IVehicleLocationList>): Subscription => {
            const updateSubject: Subject<number> = new Subject<number>();
            return concat(of(0), updateSubject.pipe(delay(refreshInterval)))
                .pipe(switchMap((timestamp: number): Observable<IVehicleLocationList> =>
                    queryFac('RAW', timestamp)), tap((locs: IVehicleLocationList): void => {
                    updateSubject.next(locs.lastUpdate);
                })).subscribe(subscriber);
        });
