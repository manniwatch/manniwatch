/*
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { IVehicleLocationList, VehicleLocations } from '@manniwatch/api-types';
import { from, Observable, OperatorFunction } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CacheEntry } from '../types';

export const convertToCacheEntry = (): OperatorFunction<IVehicleLocationList, CacheEntry> => {
    return (source: Observable<IVehicleLocationList>): Observable<CacheEntry> => {
        return source.pipe(
            mergeMap((inputList: IVehicleLocationList): Observable<CacheEntry> => {
                return from(inputList.vehicles).pipe(
                    map((item: VehicleLocations): CacheEntry => {
                        return Object.assign(
                            {
                                lastUpdate: inputList.lastUpdate,
                            },
                            item
                        );
                    })
                );
            })
        );
    };
};
