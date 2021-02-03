/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { IVehicleLocationList, PositionType } from '@manniwatch/api-types';
import { from, Observable } from 'rxjs';

/**
 * Wraps the ManniWatchApiClient getVehicleLocations method into an Observable
 * @param client ManniWatchApiClient instance
 * @param type PositionType. Default 'RAW'
 * @param lastUpdate lastUpdate. Default 0
 */
export const queryVehicles: (client: ManniWatchApiClient,
    type?: PositionType,
    lastUpdate?: number) => Observable<IVehicleLocationList> = (client: ManniWatchApiClient,
        type: PositionType = 'RAW',
        lastUpdate: number = 0): Observable<IVehicleLocationList> => {
        return from(client.getVehicleLocations(type, lastUpdate));
    };
