/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { PositionType } from '@manniwatch/api-types';

export interface IQuerySettings {
    type?: PositionType;
    lastUpdate?: number;
}
