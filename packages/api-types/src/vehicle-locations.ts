/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { VehicleCategory } from './type-util';

/**
 * Base Vehicle Location.
 * Should only be used as generic for its child implementations
 */
export interface IBaseVehicleLocation {
    /**
     * Vehicle Id
     */
    id: string;
}

/**
 * Path Segment
 */
export interface IPathSegment {
    /**
     * Start y coordinate in arcmiliseconds
     */
    y1: number;
    /**
     * Start x coordinate in arcmiliseconds
     */
    x1: number;
    /**
     * End y coordinate in arcmiliseconds
     */
    y2: number;
    /**
     * Angle in degrees
     */
    angle: number;
    /**
     * End x coordinate in arcmiliseconds
     */
    x2: number;
    /**
     * Distance between start and end
     */
    length: number;
}
export interface IDeletedVehicleLocation extends IBaseVehicleLocation {
    /**
     * Data is stale or non existend if the vehicle has been deleted
     */
    isDeleted: true;
}
/**
 * Vehicle Location
 */
export interface IVehicleLocation extends IBaseVehicleLocation {
    /**
     * Is deleted will be undefined if the vehicle hasn't been deleted
     */
    isDeleted: undefined;
    /**
     * Kind of Vehicle
     */
    category: VehicleCategory;
    color: string;
    /**
     * Heading of the vehicle in degrees
     */
    heading: number;
    /**
     * Latitude in arcmiliseconds
     */
    latitude: number;
    /**
     * Longitude in arcmiliseconds
     */
    longitude: number;
    /**
     * Humanreadable vehicle name
     */
    name: string;
    /**
     * Previous Vehicle locations
     */
    path: IPathSegment[];
    /**
     * Current TripId of the vehicle
     */
    tripId: string;
}

export type VehicleLocations = IDeletedVehicleLocation | IVehicleLocation;

export interface IVehicleLocationList {
    /**
     * Timestamp
     */
    lastUpdate: number;
    /**
     * reported locations
     */
    vehicles: VehicleLocations[];
}
