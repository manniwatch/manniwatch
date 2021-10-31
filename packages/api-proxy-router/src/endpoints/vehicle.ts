/*
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import * as prom from '@donmahallem/turbo';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import express from 'express';

/**
 * @param apiClient
 * @category Sub Routes
 */
export const createVehicleRouter: (apiClient: ManniWatchApiClient) => express.Router = (apiClient: ManniWatchApiClient): express.Router => {
    const router: express.Router = express.Router();
    /**
     * @api {get} /vehicle/:id/route Request Vehicle Route
     * @apiName GetVehicleRoute
     * @apiGroup Vehicle
     * @apiParam {string} id Vehicle id
     * @apiVersion 1.5.0
     */
    // eslint-disable-next-line no-useless-escape
    router.get('/:id([a-z0-9A-Z-+]+)/route', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        prom.promiseToResponse(apiClient.getRouteByVehicleId(req.params.id), res, next);
    });
    return router;
};
