/*!
 * Source https://github.com/manniwatch/TrapezeApiTypes
 */

export interface IWayPoint {
    lat: number;
    lon: number;
    seq: string;
}

export interface IVehiclePath {
    color: string;
    wayPoints: IWayPoint[];
}

/**
 * Previous path points
 */
export interface IVehiclePathInfo {
    paths: IVehiclePath[];
}
