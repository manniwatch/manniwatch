import { IVehicleLocationList } from "@manniwatch/api-types";

export enum PollResultStatus {
    ERROR = 'error',
    SUCCESS = 'success'
}
export interface IPollResponse {
    status: PollResultStatus.SUCCESS;
    result: IVehicleLocationList;
}
export interface IPollError {
    status: PollResultStatus.ERROR;
    error: any;
}

export type PollResult = IPollError | IPollResponse; 