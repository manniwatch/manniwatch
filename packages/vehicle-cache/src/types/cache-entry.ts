/**
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { type VehicleLocations } from '@manniwatch/api-types';

export type CacheEntry = VehicleLocations & {
    lastUpdate: number;
};
