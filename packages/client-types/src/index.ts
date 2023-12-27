/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-types
 */

import { IBoundingBox, ManniWatchApiClient } from '@manniwatch/api-client';
import {
    ITripPassages,
} from '@manniwatch/api-types';
import { IEnvironmentBase } from './environment.base.js';
export { IEnvironmentBase } from './environment.base.js';
export type TripInfoWithId = ITripPassages & { tripId: string };
export type IBounds = IBoundingBox;
type ApiMethods = Exclude<keyof ManniWatchApiClient, 'endpoint' |
    'proxies' |
    'randomUserAgent' |
    'getProxy' |
    'request' |
    'getTripPassages'>;
export type ApiService = { [k in ApiMethods]: ManniWatchApiClient[k] } & {
    getTripPassages(...args: Parameters<ManniWatchApiClient['getTripPassages']>): Promise<TripInfoWithId>,
};

export interface IElectronInterface {
    api: ApiService;
    environment: IEnvironmentBase;
}

export {
    convertTo,
    CoordinateFormat,
    IMapCoordinate,
} from './map-coordinate.js';
