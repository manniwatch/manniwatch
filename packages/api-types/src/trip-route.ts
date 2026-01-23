/**
 * Package @manniwatch/api-types
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/api-types
 */

/**
 * Response from /trip/{tripId}/route
 */
export interface ITripRoute {
    paths: ITripRoutePath[];
}
export interface ITripRoutePath {
    color: string;
    wayPoints: ITripRoutePathPoint[];
}
export interface ITripRoutePathPoint {
    /**
     * latitude in arcmilisecond
     */
    lat: number;
    /**
     * longitude in arcmilisecond
     */
    lon: number;
    /**
     * sequence number as string starting at 1
     */
    seq: string;
}
