/*
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import * as prom from '@donmahallem/turbo';
import * as turboval from '@donmahallem/turbo-validate-request';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { StopMode } from '@manniwatch/api-types';
import { STOP_PASSAGES_SCHEMA } from '@manniwatch/schemas';
import Ajv from 'ajv';
import express from 'express';

/**
 * @param apiClient
 * @param ajvInstance
 * @category Sub Routes
 */
export const createStopPointRouter: (apiClient: ManniWatchApiClient, ajvInstance?: Ajv) => express.Router = (
    apiClient: ManniWatchApiClient,
    ajvInstance: Ajv = new Ajv()
): express.Router => {
    const router: express.Router = express.Router();
    /**
     * @api {get} /stopPoint/:id/passages Request StopPoint Passages
     * @apiName GetStopPointPassages
     * @apiGroup Stop
     * @apiParam (Path Parameters) {string} id Stop id
     * @apiQuery {string="arrival","departure"} mode="departure" Departure Mode to Query
     * @apiQuery {string} startTime Start time to query
     * @apiQuery {string} timeFrame Time frame to query
     * @apiVersion 0.6.0
     */
    // eslint-disable-next-line no-useless-escape
    router.get(
        '/:id([a-z0-9A-Z-+]+)/passages',
        turboval.validateRequest('query', STOP_PASSAGES_SCHEMA),
        (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            const mode: StopMode = (req.query.mode as StopMode) || undefined;
            // tslint:disable-next-line:triple-equals
            const startTime: number | undefined =
                req.query.startTime == undefined ? undefined : parseInt(req.query.startTime as string, 10);
            // tslint:disable-next-line:triple-equals
            const timeFrame: number | undefined =
                req.query.timeFrame == undefined ? undefined : parseInt(req.query.timeFrame as string, 10);
            prom.promiseToResponse(apiClient.getStopPointPassages(req.params.id, mode, startTime, timeFrame), res, next);
        }
    );
    /**
     * @api {get} /stopPoint/:id/info Request stop point info
     * @apiName StopPointInfo
     * @apiGroup StopPoint
     * @apiParam {string} id Stop Point ID
     * @apiVersion 1.5.0
     */
    // eslint-disable-next-line no-useless-escape
    router.get('/:id([a-z0-9A-Z-+]+)/info', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        prom.promiseToResponse(apiClient.getStopPointInfo(req.params.id), res, next);
    });
    return router;
};
