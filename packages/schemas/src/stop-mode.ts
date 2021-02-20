/*!
 * Source https://github.com/manniwatch/manniwatch Package: schemas
 */

import { StopMode } from '@manniwatch/api-types';
import { RequireIdJSONSchemaType } from './util';

export const STOP_MODE_SCHEMA: RequireIdJSONSchemaType<StopMode> = {
    $id: '#manniwatch/stop_mode',
    default: 'departure',
    enum: ['departure', 'arrival'],
    type: 'string',
};
