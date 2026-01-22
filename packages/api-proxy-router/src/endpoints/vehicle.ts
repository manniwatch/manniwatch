/*
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import express from 'express';

/**
 * @param {ManniWatchApiClient} apiClient api client
 * @returns {express.Router} a express router instance
 */
export const createVehicleRouter: (apiClient: ManniWatchApiClient) => express.Router = (apiClient: ManniWatchApiClient): express.Router => {
    const router: express.Router = express.Router();
    /**
     * @api {get} /vehicle/:id/route Request Vehicle Route
     * @apiName GetVehicleRoute
     * @apiGroup Vehicle
     * @apiParam {string} id Vehicle id ([a-z0-9A-Z-+]+)
     * @apiVersion 1.5.0
     */
    // eslint-disable-next-line no-useless-escape
    router.get('/:id/route', async (req: express.Request, res: express.Response): Promise<void> => {
        const reqId: string = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        res.json(await apiClient.getRouteByVehicleId(reqId));
    });
    return router;
};
