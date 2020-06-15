/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { VEHICLE_STATUS } from './vehicle-status';

export interface ITripPassage {
    /**
     * the actual estimated time
     */
    actualTime?: string;
    /**
     * the planned time
     */
    plannedTime?: string;
    status: VEHICLE_STATUS;
    stop: {
        id: string;
        name: string;
        shortName: string;
    };
    stop_seq_num: string;
}

export interface IDepartedTripPassage extends ITripPassage {
    status: VEHICLE_STATUS.DEPARTED;
}
export interface IActualTripPassage extends ITripPassage {
    status: VEHICLE_STATUS.PLANNED | VEHICLE_STATUS.PREDICTED | VEHICLE_STATUS.STOPPING;
}
/**
 * Response from:
 * ```
 * /internetservice/services/tripInfo/tripPassages
 * ```
 * @since 0.5.0
 */
export interface ITripPassages {
    /**
     * Current/Future passages
     */
    actual: IActualTripPassage[];
    /**
     * Previous departures
     */
    old: IDepartedTripPassage[];
    /**
     * Directiontext
     */
    directionText: string;
    /**
     * Route name
     */
    routeName: string;
}
