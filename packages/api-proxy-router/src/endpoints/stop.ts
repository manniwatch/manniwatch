/*
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { validateRequest } from '@donmahallem/turbo-validate-request';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { StopMode } from '@manniwatch/api-types';
import { STOP_PASSAGES_SCHEMA } from '@manniwatch/schemas';
import Ajv from 'ajv';
import express from 'express';

/**
 * @param {ManniWatchApiClient} apiClient api client
 * @param {Ajv} ajvInstance Ajv Instance to be used
 * @returns {express.Router} a express router instance
 */
export const createStopRouter: (apiClient: ManniWatchApiClient, ajvInstance?: Ajv) => express.Router = (
    apiClient: ManniWatchApiClient
): express.Router => {
    const router: express.Router = express.Router();
    /**
     * @api {get} /stop/:id/passages Request Stop Passages
     * @apiName GetStopPassages
     * @apiGroup Stop
     * @apiParam (Path Parameters) {string} id Stop id ([a-z0-9A-Z-+]+)
     * @apiQuery {string="arrival","departure"} mode="departure" Departure Mode to Query
     * @apiQuery {string} startTime Start time to query
     * @apiQuery {string} timeFrame Time frame to query
     * @apiVersion 0.1.0
     */
    // eslint-disable-next-line no-useless-escape
    router.get(
        '/:id/passages',
        validateRequest('query', STOP_PASSAGES_SCHEMA),
        async (req: express.Request, res: express.Response): Promise<void> => {
            const mode: StopMode = (req.query.mode as StopMode) || undefined;
            // tslint:disable-next-line:triple-equals
            const startTime: number | undefined =
                req.query.startTime == undefined ? undefined : parseInt(req.query.startTime as string, 10);
            // tslint:disable-next-line:triple-equals
            const timeFrame: number | undefined =
                req.query.timeFrame == undefined ? undefined : parseInt(req.query.timeFrame as string, 10);
            const stopPointId: string = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            res.json(await apiClient.getStopPassages(stopPointId, mode, startTime, timeFrame));
        }
    );
    /**
     * @api {get} /stop/:id/info Request Stop Info
     * @apiName GetStopInfo
     * @apiGroup Stop
     * @apiParam (Path Parameters) {String} id Stop id ([a-z0-9A-Z-+]+)
     * @apiVersion 0.1.0
     */
    // eslint-disable-next-line no-useless-escape
    router.get('/:id/info', async (req: express.Request, res: express.Response): Promise<void> => {
        const reqId: string = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        res.json(await apiClient.getStopInfo(reqId));
    });
    return router;
};
