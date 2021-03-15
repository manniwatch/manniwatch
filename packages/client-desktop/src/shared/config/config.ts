/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { JSONSchemaType } from 'ajv';

export interface IConfig {
    endpoint: string;
    dev: boolean;
}

export const CONFIG_SCHEMA: JSONSchemaType<IConfig> = {
    properties: {
        dev: {
            type: 'boolean',
        },
        endpoint: {
            type: 'string',
        },
    },
    required: ['dev', 'endpoint'],
    type: 'object',
}
