/*!
 * Source https://github.com/manniwatch/manniwatch
 */

/**
 * Information about the stop location
 * @since 1.1.0
 * @category Cat1
 */
export interface IStopLocation {
    /**
     * Type of vehicle
     */
    category: string | 'bus';
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
 * @category Cat2
 */
export interface IStopLocations {
    /**
     * List of StopLocation
     */
    stops: IStopLocation[];
}
