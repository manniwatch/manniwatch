/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { CoordinateFormat } from '@manniwatch/client-types';
import Ajv from 'ajv';
import { ValidateFunction } from 'ajv/dist/types';
import { IFileConfig } from './config';

export const CONFIG_SCHEMA: any = {
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
                type: {
                    default: 'osm',
                    enum: ['vector', 'osm'],
                    nullable: true,
                    type: 'string',
                },
                url: {
                    default: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    oneOf: [{
                        nullable: true,
                        type: 'string',
                    }, {
                        nullable: true,
                        type: 'array',
                    }],
                },
            },
            required: [],
            type: 'object',
        },
    },
    required: ['map'],
    type: 'object',
};

const ajvInstance: Ajv = new Ajv();
const validateFunction: ValidateFunction = ajvInstance.compile(CONFIG_SCHEMA);
export const validateConfigFile = (fileContent: any | IFileConfig): boolean => {
    if (validateFunction(fileContent)) {
        return true;
    } else {
        // tslint:disable-next-line:no-non-null-assertion
        throw validateFunction.errors![0];
    }
};
