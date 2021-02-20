/*!
 * Source https://github.com/manniwatch/manniwatch Package: schemas
 */

import { RequireIdJSONSchemaType } from './util';

export const INT_SCHEMA: RequireIdJSONSchemaType<string | number> = {
    $id: '#manniwatch/int',
    anyOf: [
        {
            pattern: '^[\\+\\-]?\\d+$',
            type: 'string',
        },
        {
            type: 'integer',
        },
    ],
} as any;
