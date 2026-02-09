/**
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { type IVehicleLocationList, type PositionType } from '@manniwatch/api-types';
import { from, Observable } from 'rxjs';

/**
 * Wraps the ManniWatchApiClient getVehicleLocations method into an Observable
 * @param client ManniWatchApiClient instance
 * @param type PositionType. Default 'RAW'
 * @param lastUpdate lastUpdate. Default 0
 */
export const queryVehicles: (client: ManniWatchApiClient, type?: PositionType, lastUpdate?: number) => Observable<IVehicleLocationList> = (
    client: ManniWatchApiClient,
    type: PositionType = 'RAW',
    lastUpdate: number = 0
): Observable<IVehicleLocationList> => {
    return from(client.getVehicleLocations(type, lastUpdate));
};
