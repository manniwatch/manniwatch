/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import * as prom from '@manniwatch/express-utils';
import * as express from 'express';

export const createSettingsRouter: (apiClient: ManniWatchApiClient) => express.Router =
    (apiClient: ManniWatchApiClient): express.Router => {
        const router: express.Router = express.Router();
        /**
         * @api {get} /settings Request Trapeze Settings
         * @apiName GetSettings
         * @apiGroup Settings
         *
         * @apiVersion 0.1.0
         */
        router.get('', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            prom.promiseToResponse(apiClient.getSettings(), res, next);
        });
        return router;
    };
