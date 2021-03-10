/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-types
 */

import { IBoundingBox, ManniWatchApiClient } from '@manniwatch/api-client';
import {
    ITripPassages,
} from '@manniwatch/api-types';
export { IEnvironmentBase } from './environment.base';

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
