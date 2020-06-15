/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { VehicleCategory } from './type-util';

/**
 * Information about the stop location
 * @since 1.1.0
 * @category geo
 */
export interface IStopLocation {
    /**
     * Type of vehicle
     */
    category: VehicleCategory;
    /**
     * Stop Id
     */
    id: string;
    /**
     * Latitude in arcmiliseconds
     */
    latitude: number;
    /**
     * Longitutde in arcmiliseconds
     */
    longitude: number;
    /**
     * Humanreadable name of the stop
     */
    name: string;
    /**
     * Stop short id
     */
    shortName: string;
}

/**
 * Response for
 * ```
 * /internetservice/geoserviceDispatcher/services/stopinfo/stops
 * ```
 * @since 1.1.0
 * @category geo
 */
export interface IStopLocations {
    /**
     * List of StopLocation
     */
    stops: IStopLocation[];
}
