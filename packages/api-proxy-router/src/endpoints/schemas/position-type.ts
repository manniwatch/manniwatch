/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { PositionType } from '@manniwatch/api-types';
import { JSONSchemaType } from 'ajv';

export const POSITION_TYPE_SCHEMA: JSONSchemaType<PositionType> = {
    $id: '#manniwatch/position_type',
    default: 'RAW',
    description: 'position type to query',
    enum: ['RAW', 'CORRECTED'],
    type: 'string',
};
