/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { IVehicleLocation, IVehicleLocationList } from '@manniwatch/api-types';
import { ITimestampedVehicleLocation, VehicleDiffHandler } from '@manniwatch/vehicle-location-diff';
import { from, Observable, OperatorFunction, Subject, Subscriber, Subscription } from 'rxjs';
import { delay, flatMap, scan, startWith, tap } from 'rxjs/operators';
import { CacheMessageType, IUpdateCacheMessage } from './cache-message';

export interface IVehicleTimestampMap { [key: string]: ITimestampedVehicleLocation; }

export const mapVehicleList = (val: IVehicleLocationList): IVehicleTimestampMap => {
    const tMap: IVehicleTimestampMap = {};
    val.vehicles.forEach((veh: IVehicleLocation): void => {

    });
    return tMap;
};

export const scanDiff = (initial?: IUpdateCacheMessage): OperatorFunction<IVehicleLocationList, IUpdateCacheMessage> => {
    return scan((acc: IUpdateCacheMessage, val: IVehicleLocationList): IUpdateCacheMessage => {
        const vehicleList: ITimestampedVehicleLocation[] = VehicleDiffHandler.convert(val);
        return {
            diff: VehicleDiffHandler.diff((acc && acc.diff) ? acc.diff : undefined, vehicleList),
            lastUpdate: val.lastUpdate,
            type: CacheMessageType.UPDATE,
        };
    }, initial as IUpdateCacheMessage);
};
export const createVehicleObservable: (client: ManniWatchApiClient, refreshInterval: number) => Observable<IVehicleLocationList> =
    (client: ManniWatchApiClient, refreshInterval: number = 60000): Observable<IVehicleLocationList> => {
        return new Observable<IVehicleLocationList>((subscriber: Subscriber<IVehicleLocationList>): Subscription => {
            const updateSubject: Subject<number> = new Subject<number>();
            return updateSubject.pipe(delay(refreshInterval), startWith(0),
                flatMap((timestamp: number, idx: number): Observable<IVehicleLocationList> => {
                    return from(client.getVehicleLocations('RAW', timestamp));
                }),
                tap((locs: IVehicleLocationList): void => {
                    updateSubject.next(locs.lastUpdate);
                })).subscribe(subscriber);
        });
    };
