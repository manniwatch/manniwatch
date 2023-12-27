/*
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import { RequireIdJSONSchemaType } from './util.js';

export const UINT_SCHEMA: RequireIdJSONSchemaType<string | number> = {
    $id: '#manniwatch/uint',
    anyOf: [
        {
            pattern: '^\\+?\\d+$',
            type: 'string',
        },
        {
            minimum: 0,
            type: 'integer',
        },
    ],
};
