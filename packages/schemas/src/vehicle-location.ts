/*
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import { PositionType } from '@manniwatch/api-types';
import { JSONSchemaType } from 'ajv';
import { POSITION_TYPE_SCHEMA } from './position-type.js';
import { UINT_SCHEMA } from './uint.js';

export interface IGeoLocationSchema {
    lastUpdate?: string;
    positionType?: PositionType;
}
export const GET_VEHICLE_LOCATION_SCHEMA: JSONSchemaType<IGeoLocationSchema> = {
    $id: '#manniwatch/vehicle_location',
    additionalProperties: false,
    definitions: {
        [UINT_SCHEMA.$id]: UINT_SCHEMA,
        [POSITION_TYPE_SCHEMA.$id]: POSITION_TYPE_SCHEMA,
    },
    properties: {
        lastUpdate: {
            $ref: UINT_SCHEMA.$id,
            default: '0',
            description: 'unix timestamp in ms since epoch',
        },
        positionType: {
            $ref: POSITION_TYPE_SCHEMA.$id,
        },
    },
    required: [],
    type: 'object',
};
