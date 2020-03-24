/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import * as prom from '@manniwatch/express-utils';
import * as express from 'express';

export const createTripRouter: (apiClient: ManniWatchApiClient) => express.Router =
    (apiClient: ManniWatchApiClient): express.Router => {
        const router: express.Router = express.Router();
        /**
         * @api {get} /trip/:id/route Request Vehicle Route
         * @apiName GetTripRoute
         * @apiGroup Trip
         *
         * @apiParam {String} id Vehicle id
         * @apiVersion 0.1.0
         */
        router.get('/:id([a-z0-9A-Z\-\+]+)/route', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            prom.promiseToResponse(apiClient.getRouteByTripId(req.params.id), res, next);
        });
        return router;
    };
