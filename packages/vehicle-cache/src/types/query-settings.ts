/**
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { type PositionType } from '@manniwatch/api-types';

export interface IQuerySettings {
    type?: PositionType;
    lastUpdate?: number;
}
