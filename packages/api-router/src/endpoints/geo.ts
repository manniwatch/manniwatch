/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { promiseToResponse } from '@donmahallem/turbo';
import { validateRequest } from '@donmahallem/turbo-validate-request'
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { PositionType } from '@manniwatch/api-types';
import * as express from 'express';
import * as jsonschema from 'jsonschema';

export const geoFenceSchema: jsonschema.Schema = {
    id: 'geoFenceSchema',
    properties: {
        bottom: {
            id: 'bottom',
            pattern: '^[\\+\\-]?\\d+$',
            type: 'string',
        },
        left: {
            id: 'left',
            pattern: '^[\\+\\-]?\\d+$',
            type: 'string',
        },
        right: {
            id: 'right',
            pattern: '^[\\+\\-]?\\d+$',
            type: 'string',
        },
        top: {
            id: 'top',
            pattern: '^[\\+\\-]?\\d+$',
            type: 'string',
        },
    },
    required: ['top', 'bottom', 'right', 'left'],
    type: 'object',
};

export const getVehicleLocationSchema: jsonschema.Schema = {
    additionalProperties: false,
    id: 'getVehicleLocationSchema',
    properties: {
        lastUpdate: {
            description: 'unix timestamp in ms since epoch',
            id: 'lastUpdate',
            pattern: '^[0-9]+$',
            type: 'string',
        },
        positionType: {
            description: 'position type to query',
            enum: ['RAW', 'CORRECTED'],
            id: 'positionType',
            type: 'string',
        },
    },
    type: 'object',
};
export const createGeoRouter: (apiClient: ManniWatchApiClient) => express.Router =
    (apiClient: ManniWatchApiClient): express.Router => {
        const router: express.Router = express.Router();
        /**
         * @api {get} /geo/stops Request stop locations
         * @apiName StopLocations
         * @apiGroup Geo
         *
         * @apiVersion 0.1.0
         */
        router.get('/stops',
            validateRequest('query', geoFenceSchema),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                promiseToResponse(apiClient.getStopLocations({
                    bottom: parseInt(req.query.bottom as string, 10),
                    left: parseInt(req.query.left as string, 10),
                    right: parseInt(req.query.right as string, 10),
                    top: parseInt(req.query.top as string, 10),
                }), res, next);
            });
        /**
         * @api {get} /geo/stopPoints Request stop locations
         * @apiName StopPointLocations
         * @apiGroup Geo
         *
         * @apiVersion 0.4.0
         */
        router.get('/stopPoints',
            validateRequest('query', geoFenceSchema),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                promiseToResponse(apiClient.getStopPointLocations({
                    bottom: parseInt(req.query.bottom as string, 10),
                    left: parseInt(req.query.left as string, 10),
                    right: parseInt(req.query.right as string, 10),
                    top: parseInt(req.query.top as string, 10),
                }), res, next);
            });
        /**
         * @api {get} /geo/vehicles Request vehicle locations
         * @apiName GetVehicleLocations
         * @apiGroup Geo
         *
         * @apiVersion 0.1.0
         */
        router.get('/vehicles',
            validateRequest('query', getVehicleLocationSchema),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                // tslint:disable-next-line:triple-equals
                const positionType: PositionType = (req.query.positionType as PositionType) || 'RAW';
                const lastUpdate: number | undefined = req.query.lastUpdate ?
                    parseInt(req.query.lastUpdate as string, 10) :
                    undefined;
                promiseToResponse(apiClient.getVehicleLocations(positionType, lastUpdate), res, next);
            });
        return router;
    };
