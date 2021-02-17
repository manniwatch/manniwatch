import { JSONSchemaType } from "ajv";

export const UINT_SCHEMA: JSONSchemaType<string | number> = {
    $id: '#manniwatch/uint',
    anyOf: [
        {
            pattern: '^\\+?\\d+$',
            type: 'string',
        },
        {
            minimum: 0,
            type: 'integer',
        }
    ],
} as any;
