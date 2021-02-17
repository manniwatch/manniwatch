import { JSONSchemaType } from "ajv";

export const INT_SCHEMA: JSONSchemaType<string | number> = {
    $id: '#manniwatch/int',
    anyOf: [
        {
            pattern: '^[\\+\\-]?\\d+$',
            type: 'string',
        },
        {
            type: 'integer',
        }
    ],
} as any;
