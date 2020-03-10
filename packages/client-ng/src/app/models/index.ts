import {
    IStopLocation,
    IStopPointLocation,
    IVehicleLocation,
} from '@donmahallem/trapeze-api-types';

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
