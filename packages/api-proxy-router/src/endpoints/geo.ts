/*!
 * Source https://github.com/manniwatch/trapeze Package: trapeze-api-proxy-router
 */

import { PositionType, TrapezeApiClient } from '@manniwatch/trapeze-api-client';
import * as express from 'express';
import * as jsonschema from 'jsonschema';
import { promiseToResponse } from '../promise-to-response';

const numberPattern: jsonschema.Schema = {
    oneOf: [
        {
            type: 'number',
        }, {
            pattern: '^[\\+\\-]?\\d+$',
            type: 'string',
        },
    ],
};
export const geoFenceSchema: jsonschema.Schema = {
    properties: {
        bottom: numberPattern,
        left: numberPattern,
        right: numberPattern,
        top: numberPattern,
    },
    required: ['top', 'bottom', 'right', 'left'],
    type: 'object',
};

export const getVehicleLocationSchema: jsonschema.Schema = {
    additionalProperties: false,
    properties: {
        lastUpdate: {
            description: 'unix timestamp in ms since epoch',
            minimum: 0,
        },
        positionType: {
            description: 'position type to query',
            'enum': ['RAW', 'CORRECTED'],
            'type': 'string',
        },
    },
    type: 'object',
};

export class GeoEndpoints {
    public static createStationLocationsEndpoint(client: TrapezeApiClient): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            // promiseToResponse(client.getStopLocations(), null, res, next);
        };
    }
    public static createVehicleLocationsEndpoint(client: TrapezeApiClient): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            const result: jsonschema.ValidatorResult = jsonschema.validate(req.query, getVehicleLocationSchema);
            if (result.valid) {
                const queryParams: {
                    lastUpdate?: number,
                    positionType?: PositionType,
                } = result.instance;
                promiseToResponse(client.getVehicleLocations(
                    // tslint:disable-next-line:triple-equals
                    queryParams.positionType != undefined ? queryParams.positionType : 'RAW',
                    queryParams.lastUpdate,
                ), undefined as any, res, next);
            } else {
                next(new Error('Invalid number or type of query parameters'));
            }
        };
    }
}
