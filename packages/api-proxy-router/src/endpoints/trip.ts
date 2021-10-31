/*
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import * as prom from '@donmahallem/turbo';
import * as turboval from '@donmahallem/turbo-validate-request';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { StopMode } from '@manniwatch/api-types';
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
     * @apiParam {string} id Vehicle id
     * @apiVersion 0.1.0
     */
    // eslint-disable-next-line no-useless-escape
    router.get('/:id([a-z0-9A-Z-+]+)/route', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        prom.promiseToResponse(apiClient.getRouteByTripId(req.params.id), res, next);
    });

    /**
     * @api {get} /trip/:id/passages Request Trip Passages
     * @apiName GetTripPassages
     * @apiGroup Trip
     * @apiParam {string} id Vehicle id
     * @apiQuery {string="arrival","departure"} [departureMode="departure"] Default departure mode
     * @apiVersion 0.5.0
     */
    // eslint-disable-next-line no-useless-escape
    router.get(
        '/:id([a-z0-9A-Z-+]+)/passages',
        turboval.validateRequest('query', TRIP_PASSAGES_SCHEMA, ajvInstance),
        (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            const departureMode: StopMode = (req.query.mode as StopMode) || 'departure';
            prom.promiseToResponse(apiClient.getTripPassages(req.params.id, departureMode), res, next);
        }
    );
    return router;
};
