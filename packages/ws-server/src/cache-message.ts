/*!
 * Source https://github.com/manniwatch/manniwatch Package: @manniwatch/ws-server
 */

import { ITimestampedVehicleLocation } from '@manniwatch/vehicle-location-diff';
export enum CacheMessageType {
    ERROR = 'error',
    UPDATE = 'update',
}
export interface ICacheState { [key: string]: ITimestampedVehicleLocation; }
interface ICacheMessage {
    lastUpdate: number;
    state: ICacheState;
    type: CacheMessageType;
}
export interface IErrorCacheMessage extends ICacheMessage {
    error: any;
    type: CacheMessageType.ERROR;
}

export interface IUpdateCacheMessage extends ICacheMessage {
    diff: ITimestampedVehicleLocation[];
    type: CacheMessageType.UPDATE;
}

export type CacheMessage = IErrorCacheMessage | IUpdateCacheMessage;
