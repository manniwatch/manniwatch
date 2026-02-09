/**
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import { type PositionType } from '@manniwatch/api-types';
import { RequireIdJSONSchemaType } from './util.js';

export const POSITION_TYPE_SCHEMA: RequireIdJSONSchemaType<PositionType> = {
    $id: '#manniwatch/position_type',
    default: 'RAW',
    description: 'position type to query',
    enum: ['RAW', 'CORRECTED'],
    type: 'string',
};
