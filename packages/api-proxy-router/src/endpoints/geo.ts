/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient, PositionType } from '@manniwatch/api-client';
import { validateRequest } from '@manniwatch/express-utils';
import * as express from 'express';
import * as jsonschema from 'jsonschema';
import { promiseToResponse } from '../promise-to-response';

export const geoFenceSchema: jsonschema.Schema = {
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
    properties: {
        lastUpdate: {
            description: 'unix timestamp in ms since epoch',
            id: 'lastUpdate',
            'pattern': '^[0-9]+$',
            'type': 'string',
        },
        positionType: {
            description: 'position type to query',
            'enum': ['RAW', 'CORRECTED'],
            id: 'positionType',
            'type': 'string',
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
            validateRequest({
                query: geoFenceSchema,
            }),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                promiseToResponse(apiClient.getStopLocations({
                    bottom: req.query.bottom,
                    left: req.query.left,
                    right: req.query.right,
                    top: req.query.top,
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
            validateRequest({
                query: getVehicleLocationSchema,
            }),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                // tslint:disable-next-line:triple-equals
                const positionType: PositionType = req.query.positionType != undefined ? req.query.positionType : 'RAW';
                const lastUpdate: string | number = req.query.lastUpdate;
                promiseToResponse(apiClient.getVehicleLocations(positionType, lastUpdate), res, next);
            });
        return router;
    };
