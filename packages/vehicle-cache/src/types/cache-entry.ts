/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { VehicleLocations } from '@manniwatch/api-types';

export type CacheEntry = VehicleLocations & {
    lastUpdate: number;
};
