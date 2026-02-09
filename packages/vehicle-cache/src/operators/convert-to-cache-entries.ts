/**
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { type IVehicleLocationList, type VehicleLocations } from '@manniwatch/api-types';
import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { CacheEntry } from '../types';

export const convertToCacheEntries = (): OperatorFunction<IVehicleLocationList, CacheEntry[]> => {
    return (source: Observable<IVehicleLocationList>): Observable<CacheEntry[]> => {
        return source.pipe(
            map((inputList: IVehicleLocationList): CacheEntry[] => {
                return inputList.vehicles.map((loc: VehicleLocations): CacheEntry => {
                    return Object.assign(
                        {
                            lastUpdate: inputList.lastUpdate,
                        },
                        loc
                    );
                });
            })
        );
    };
};
