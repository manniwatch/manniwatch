/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/api-proxy-router
*/

import { ManniWatchApiClient } from '@manniwatch/api-client';
import * as prom from '@manniwatch/express-utils';
import * as express from 'express';

export const createVehicleRouter: (apiClient: ManniWatchApiClient) => express.Router =
    (apiClient: ManniWatchApiClient): express.Router => {
        const router: express.Router = express.Router();
        /**
         * @api {get} /vehicle/:id/route Request Vehicle Route
         * @apiName GetVehicleRoute
         * @apiGroup Vehicle
         *
         * @apiParam {String} id Vehicle id
         * @apiVersion 1.5.0
         */
        router.get('/:id([a-z0-9A-Z\-\+]+)/route', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            prom.promiseToResponse(apiClient.getRouteByVehicleId(req.params.id), res, next);
        });
        return router;
    };
