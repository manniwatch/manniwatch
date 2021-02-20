/*!
 * Source https://github.com/manniwatch/manniwatch Package: schemas
 */

import { PositionType } from '@manniwatch/api-types';
import { RequireIdJSONSchemaType } from './util';

export const POSITION_TYPE_SCHEMA: RequireIdJSONSchemaType<PositionType> = {
    $id: '#manniwatch/position_type',
    default: 'RAW',
    description: 'position type to query',
    enum: ['RAW', 'CORRECTED'],
    type: 'string',
};
