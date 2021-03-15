/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { IEnvironmentBase } from '@manniwatch/client-types';
import { JSONSchemaType } from 'ajv';

export interface IConfig {
    map: {
        center: Required<IEnvironmentBase['map']>,
    };
    dev: boolean;
    endpoint: string;
}

export const CONFIG_SCHEMA: JSONSchemaType<IConfig> = {
    properties: {
        dev: {
            type: 'boolean',
        },
        endpoint: {
            default: '',
            type: 'string',
        },
    },
    required: ['dev', 'endpoint'],
    type: 'object',
}
