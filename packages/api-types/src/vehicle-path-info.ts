/*!
 * Source https://github.com/manniwatch/manniwatch
 */

export interface IWayPoint {
    /**
     * Latitude in arcms
     */
    lat: number;
    /**
     * Longitude in arcms
     */
    lon: number;
    /**
     * Sequence Number
     */
    seq: string;
}

export interface IVehiclePath {
    /**
     * Color to be used to represent the path
     */
    color: string;
    /**
     * Waypoints of Vehicle
     */
    wayPoints: IWayPoint[];
}

/**
 * Previous path points
 */
export interface IVehiclePathInfo {
    /**
     * Vehicle Paths Information
     */
    paths: IVehiclePath[];
}
