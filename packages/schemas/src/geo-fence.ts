/*!
 * Source https://github.com/manniwatch/manniwatch Package: schemas
 */

import { JSONSchemaType } from 'ajv';
import { INT_SCHEMA } from './int';

export interface IGeoFenceSchema {
    bottom: string;
    left: string;
    right: string;
    top: string;
}

export const GEO_FENCE_SCHEMA: JSONSchemaType<IGeoFenceSchema> = {
    $id: '#manniwatch/geo_fence',
    definitions: {
        [INT_SCHEMA.$id]: INT_SCHEMA,
    },
    properties: {
        bottom: {
            $ref: INT_SCHEMA.$id,
        },
        left: {
            $ref: INT_SCHEMA.$id,
        },
        right: {
            $ref: INT_SCHEMA.$id,
        },
        top: {
            $ref: INT_SCHEMA.$id,
        },
    },
    required: ['top', 'bottom', 'right', 'left'],
    type: 'object',
};
