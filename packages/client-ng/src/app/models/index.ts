/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import {
    IStopLocation,
    IStopPointLocation,
    IVehicleLocation,
} from '@manniwatch/api-types';

export interface ITimestampVehicleLocation {
    /**
     * Timestamp of last checkup
     */
    timestamp: number;
    /**
     * Vehicle location
     */
    vehicle: IVehicleLocation;
}

export type LocationObject = IVehicleLocation | IStopLocation | IStopPointLocation;
