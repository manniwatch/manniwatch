/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import * as prom from '@manniwatch/express-utils';
import * as express from 'express';

export const createStopPointRouter: (apiClient: ManniWatchApiClient) => express.Router =
    (apiClient: ManniWatchApiClient): express.Router => {
        const router: express.Router = express.Router();
        /**
         * @api {get} /stopPoint/:id/info Request stop point info
         * @apiName StopPointInfo
         * @apiGroup StopPoint
         *
         * @apiParam {String} id Stop Point ID
         * @apiVersion 1.5.0
         */
        router.get('/:id([a-z0-9A-Z\-\+]+)/info', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            prom.promiseToResponse(apiClient.getStopPointInfo(req.params.id), res, next);
        });
        return router;
    };
