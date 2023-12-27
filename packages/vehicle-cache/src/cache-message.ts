/*
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { IVehicleLocationDiff } from '@manniwatch/vehicle-location-diff';
export enum CacheMessageType {
    ERROR = 'error',
    UPDATE = 'update',
}
interface ICacheMessage {
    lastUpdate: number;
    type: CacheMessageType;
}
export interface IErrorCacheMessage extends ICacheMessage {
    error: unknown;
    type: CacheMessageType.ERROR;
}

export interface IUpdateCacheMessage extends ICacheMessage {
    diff: IVehicleLocationDiff;
    type: CacheMessageType.UPDATE;
}

export type CacheMessage = IErrorCacheMessage | IUpdateCacheMessage;
