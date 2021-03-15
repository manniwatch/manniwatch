/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { CoordinateFormat, IMapCoordinate } from '@manniwatch/client-types';
import { JSONSchemaType } from 'ajv';

export interface IConfig {
    dev: boolean;
    endpoint: string;
}

export interface IFileConfig {
    map: {
        center?: IMapCoordinate<CoordinateFormat>,
    };
}

export const CONFIG_SCHEMA: JSONSchemaType<IFileConfig> = {
    properties: {
        map: {
            properties: {
                center: {
                    additionalProperties: false,
                    default: {
                        lat: 0,
                        lon: 0,
                    },
                    nullable: true,
                    properties: {
                        format: {
                            default: CoordinateFormat.ARC_MILISECOND,
                            enum: [
                                CoordinateFormat.ARC_MILISECOND,
                                CoordinateFormat.ARC_SECOND,
                                CoordinateFormat.ARC_MINUTE,
                                CoordinateFormat.ARC_HOUR,
                            ],
                            nullable: true,
                            type: 'string',
                        },
                        lat: {
                            default: 0,
                            type: 'number',
                        },
                        lon: {
                            default: 0,
                            type: 'number',
                        },
                    },
                    required: ['lat', 'lon'],
                    type: 'object',
                },
            },
            required: [],
            type: 'object',
        },
    },
    required: ['map'],
    type: 'object',
};
