/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/api-types
*/

/**
 * Vehicle status
 *
 * @since 1.0.0
 */
export enum VEHICLE_STATUS {
    /**
     * Vehicle is predicted to arrive
     */
    PREDICTED = 'PREDICTED',
    /**
     * The vehicle is departed
     */
    DEPARTED = 'DEPARTED',
    /**
     * If the vehicle is currently stopping
     */
    STOPPING = 'STOPPING',
    /**
     * If the trip is planned
     */
    PLANNED = 'PLANNED',
}
