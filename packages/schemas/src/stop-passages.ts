/*
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import { StopMode } from '@manniwatch/api-types';
import { JSONSchemaType } from 'ajv';
import { STOP_MODE_SCHEMA } from './stop-mode.js';
import { UINT_SCHEMA } from './uint.js';

export interface IStopPassagesSchema {
    mode?: StopMode;
    startTime?: string;
    timeFrame?: string;
}
export const STOP_PASSAGES_SCHEMA: JSONSchemaType<IStopPassagesSchema> = {
    additionalProperties: false,
    definitions: {
        [UINT_SCHEMA.$id]: UINT_SCHEMA,
        [STOP_MODE_SCHEMA.$id]: STOP_MODE_SCHEMA,
    },
    properties: {
        mode: {
            $ref: STOP_MODE_SCHEMA.$id,
        },
        startTime: {
            $ref: UINT_SCHEMA.$id,
            description: 'startTime to query',
        },
        timeFrame: {
            $ref: UINT_SCHEMA.$id,
            description: 'timeFrame to query',
        },
    },
    required: [],
    type: 'object',
};
