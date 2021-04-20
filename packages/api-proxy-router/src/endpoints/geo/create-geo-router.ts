/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import * as turbo from '@donmahallem/turbo';
import { validateRequest } from '@donmahallem/turbo-validate-request';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { GEO_FENCE_SCHEMA, GET_VEHICLE_LOCATION_SCHEMA } from '@manniwatch/schemas';
import express from 'express';
import NodeCache from 'node-cache';
import { createGetRequestHandler } from './vehicles';

console.log(validateRequest, createGetRequestHandler);
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
            validateRequest('query', GEO_FENCE_SCHEMA),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                turbo.promiseToResponse(apiClient.getStopLocations({
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
            validateRequest('query', GEO_FENCE_SCHEMA),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                turbo.promiseToResponse(apiClient.getStopPointLocations({
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
            validateRequest('query', GET_VEHICLE_LOCATION_SCHEMA),
            (req: express.Request<any, any, any, {
                lastUpdate?: string | number,
                positionType?: string,
            }>, res: express.Response,
                next: express.NextFunction): void => {
                if (typeof req.query.lastUpdate === 'string') {
                    req.query.lastUpdate = parseInt(req.query.lastUpdate, 10);
                } else {
                    req.query.lastUpdate = 0;
                }
                if (typeof req.query.positionType === 'string') {
                    req.query.positionType = req.query.positionType.toUpperCase();
                } else {
                    req.query.positionType = 'RAW';
                }
                next();
            },
            createGetRequestHandler({
                api: apiClient,
                cache: new NodeCache(),
            }));
        return router;
    };
