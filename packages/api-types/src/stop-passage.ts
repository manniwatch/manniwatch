/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { VehicleCategory } from './type-util';
import { VEHICLE_STATUS } from './vehicle-status';

/**
 * Departure information for vehicles
 */
export interface IDeparture {
    /**
     * Time in seconds estimated from server time to arrival
     */
    actualRelativeTime: number;
    /**
     * Time of arrivabl formated HH:mm
     */
    actualTime: string;
    direction: string;
    mixedTime: string;
    passageid: string;
    patternText: string;
    /**
     * Planned time of arrival
     */
    plannedTime: string;
    routeId: string;
    /**
     * Current status of the vehicle
     */
    status: VEHICLE_STATUS;
    tripId: string;
    vehicleId: string;
}

/**
 * Status for departed vehicles
 */
export interface IDepartedDeparture extends IDeparture {
    status: VEHICLE_STATUS.DEPARTED;
}
/**
 * Departure status for non departed vehicles
 */
export interface IActualDeparture extends IDeparture {
    status: VEHICLE_STATUS.PREDICTED | VEHICLE_STATUS.PLANNED | VEHICLE_STATUS.STOPPING;
}

/**
 * Alerts on route
 */
export interface IRouteAlert {
    direction: string[];
    directionId: string;
    title: string;
}

/**
 * Route of the vehicle
 */
export interface IRoute {
    alerts: IRouteAlert[];
    authority: string;
    directions: string[];
    id: string;
    name: string;
    routeType: VehicleCategory;
    // route short name
    shortName: string;
}
/**
 * @since 0.5.0
 */
export interface IStopPassage {
    /**
     * Actual/Future Departures
     */
    actual: IActualDeparture[];
    directions: any[];
    firstPassageTime: number;
    /**
     * TODO: Need schema
     */
    generalAlerts: any[];
    lastPassageTime: number;
    /**
     * Previous departures
     */
    old: IDepartedDeparture[];
    /**
     * Routes served by this stop
     */
    routes: IRoute[];
    /**
     * Human readable string of the stop
     */
    stopName: string;
    /**
     * short name of the stop
     */
    stopShortName: string;
}
