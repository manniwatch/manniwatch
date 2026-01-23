/**
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import { RequireIdJSONSchemaType } from './util.js';

export const INT_SCHEMA: RequireIdJSONSchemaType<string | number> = {
    $id: '#manniwatch/int',
    oneOf: [
        {
            pattern: '^[\\+\\-]?\\d+$',
            type: 'string',
        },
        {
            type: 'integer',
        },
    ],
};
