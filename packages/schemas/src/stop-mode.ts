/*
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import { StopMode } from '@manniwatch/api-types';
import { RequireIdJSONSchemaType } from './util.js';

export const STOP_MODE_SCHEMA: RequireIdJSONSchemaType<StopMode> = {
    $id: '#manniwatch/stop_mode',
    default: 'departure',
    enum: ['departure', 'arrival'],
    type: 'string',
};
