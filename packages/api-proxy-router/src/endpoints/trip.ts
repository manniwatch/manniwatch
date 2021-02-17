/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import * as prom from '@donmahallem/turbo';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { StopMode } from '@manniwatch/api-types';
import Ajv from 'ajv';
import express from 'express';
import { TRIP_PASSAGES_SCHEMA } from './schemas';

export const createTripRouter: (apiClient: ManniWatchApiClient, ajvInstance?: Ajv) => express.Router =
    (apiClient: ManniWatchApiClient, ajvInstance: Ajv = new Ajv()): express.Router => {
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

        /**
         * @api {get} /trip/:id/passages Request Trip Passages
         * @apiName GetTripPassages
         * @apiGroup Trip
         *
         * @apiParam {String} id Vehicle id
         * @apiVersion 0.5.0
         */
        router.get('/:id([a-z0-9A-Z\-\+]+)/passages',
            prom.validateRequest('query', TRIP_PASSAGES_SCHEMA, ajvInstance),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                const departureMode: StopMode = req.query.mode as StopMode || 'departure';
                prom.promiseToResponse(apiClient.getTripPassages(req.params.id, departureMode), res, next);
            });
        return router;
    };
