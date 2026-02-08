/**
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { validateRequest } from '@donmahallem/turbo-validate-request';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { type StopMode } from '@manniwatch/api-types';
import { TRIP_PASSAGES_SCHEMA } from '@manniwatch/schemas';
import Ajv from 'ajv';
import express from 'express';

/**
 * @param {ManniWatchApiClient} apiClient api client
 * @param {Ajv} ajvInstance Ajv Instance to be used
 * @returns {express.Router} a express router instance
 */
export const createTripRouter: (apiClient: ManniWatchApiClient, ajvInstance?: Ajv) => express.Router = (
    apiClient: ManniWatchApiClient,
    ajvInstance: Ajv = new Ajv()
): express.Router => {
    const router: express.Router = express.Router();
    /**
     * @api {get} /trip/:id/route Request Vehicle Route
     * @apiName GetTripRoute
     * @apiGroup Trip
     * @apiParam {string} id Vehicle id ([a-z0-9A-Z-+]+)
     * @apiVersion 0.1.0
     */

    router.get('/:id/route', async (req: express.Request, res: express.Response): Promise<void> => {
        const reqId: string = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        res.json(await apiClient.getRouteByTripId(reqId));
    });

    /**
     * @api {get} /trip/:id/passages Request Trip Passages
     * @apiName GetTripPassages
     * @apiGroup Trip
     * @apiParam {string} id Vehicle id ([a-z0-9A-Z-+]+)
     * @apiQuery {string="arrival","departure"} [departureMode="departure"] Default departure mode
     * @apiVersion 0.5.0
     */

    router.get(
        '/:id/passages',
        validateRequest('query', TRIP_PASSAGES_SCHEMA, ajvInstance),
        async (req: express.Request, res: express.Response): Promise<void> => {
            const departureMode: StopMode = (req.query.mode as StopMode) || 'departure';
            const reqId: string = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            res.json(await apiClient.getTripPassages(reqId, departureMode));
        }
    );
    return router;
};
