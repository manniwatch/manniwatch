/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { StopMode } from '@manniwatch/api-types';
import { JSONSchemaType } from 'ajv';
import { STOP_MODE_SCHEMA } from './stop-mode';

export interface ITripPassagesSchema {
    mode: StopMode;
}

export const TRIP_PASSAGES_SCHEMA: JSONSchemaType<ITripPassagesSchema> = {
    additionalProperties: false,
    definitions: {
        [STOP_MODE_SCHEMA.$id!]: STOP_MODE_SCHEMA,
    },
    properties: {
        mode: {
            $ref: STOP_MODE_SCHEMA.$id!,
        },
    },
    required: [],
    type: 'object',
};
