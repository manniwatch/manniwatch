/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import * as turbo from '@donmahallem/turbo';
import * as turboval from '@donmahallem/turbo-validate-request';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { PositionType } from '@manniwatch/api-types';
import { GEO_FENCE_SCHEMA, GET_VEHICLE_LOCATION_SCHEMA } from '@manniwatch/schemas';
import express from 'express';

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
            turboval.validateRequest('query', GEO_FENCE_SCHEMA),
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
            turboval.validateRequest('query', GEO_FENCE_SCHEMA),
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
            turboval.validateRequest('query', GET_VEHICLE_LOCATION_SCHEMA),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                // tslint:disable-next-line:triple-equals
                const positionType: PositionType = (req.query.positionType as PositionType) || 'RAW';
                const lastUpdate: number | undefined = req.query.lastUpdate ?
                    parseInt(req.query.lastUpdate as string, 10) :
                    undefined;
                turbo.promiseToResponse(apiClient.getVehicleLocations(positionType, lastUpdate), res, next);
            });
        return router;
    };
