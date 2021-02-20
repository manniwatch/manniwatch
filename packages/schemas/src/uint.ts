/*!
 * Source https://github.com/manniwatch/manniwatch Package: schemas
 */

import { RequireIdJSONSchemaType } from './util';

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
} as any;
