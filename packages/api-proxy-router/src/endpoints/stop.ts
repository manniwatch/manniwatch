/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import * as prom from '@donmahallem/turbo';
import * as turboval from '@donmahallem/turbo-validate-request';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { StopMode } from '@manniwatch/api-types';
import { STOP_PASSAGES_SCHEMA } from '@manniwatch/schemas';
import Ajv from 'ajv';
import express from 'express';

export const createStopRouter: (apiClient: ManniWatchApiClient, ajvInstance?: Ajv) => express.Router =
    (apiClient: ManniWatchApiClient, ajvInstance: Ajv = new Ajv()): express.Router => {
        const router: express.Router = express.Router();
        /**
         * @api {get} /stop/:id/passages Request Stop Passages
         * @apiName GetStopPassages
         * @apiGroup Stop
         *
         * @apiParam {String} id Stop id
         * @apiParam {String} [mode="arrival","departure"]
         * @apiParam {String} [startTime]
         * @apiParam {String} [timeFrame]
         * @apiVersion 0.1.0
         */
        router.get('/:id([a-z0-9A-Z\-\+]+)/passages',
            turboval.validateRequest('query', STOP_PASSAGES_SCHEMA),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                const mode: StopMode = req.query.mode as StopMode || undefined;
                // tslint:disable-next-line:triple-equals
                const startTime: number | undefined = req.query.startTime == undefined ?
                    undefined :
                    parseInt(req.query.startTime as string, 10);
                // tslint:disable-next-line:triple-equals
                const timeFrame: number | undefined = req.query.timeFrame == undefined ?
                    undefined :
                    parseInt(req.query.timeFrame as string, 10);
                prom.promiseToResponse(apiClient.getStopPassages(req.params.id,
                    mode,
                    startTime,
                    timeFrame), res, next);
            });
        /**
         * @api {get} /stop/:id/info Request Stop Info
         * @apiName GetStopInfo
         * @apiGroup Stop
         *
         * @apiParam {String} id Stop id
         * @apiVersion 0.1.0
         */
        router.get('/:id([a-z0-9A-Z\-\+]+)/info',
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                prom.promiseToResponse(apiClient.getStopInfo(req.params.id), res, next);
            });
        return router;
    };
