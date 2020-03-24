/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import * as prom from '@manniwatch/express-utils';
import * as express from 'express';
import { Schema } from 'jsonschema';

export const passagesSchema: Schema = {
    additionalProperties: false,
    properties: {
        mode: {
            description: 'unix timestamp in ms since epoch',
            enum: ['departure', 'arrival'],
            id: 'mode',
            type: 'string',
        },
        startTime: {
            description: 'startTime to query',
            id: 'startTime',
            pattern: '^\\d+$',
            type: 'string',
        },
        timeFrame: {
            description: 'timeFrame to query',
            id: 'timeFrame',
            pattern: '^\\d+$',
            type: 'string',
        },
    },
    type: 'object',
};
export const createStopRouter: (apiClient: ManniWatchApiClient) => express.Router =
    (apiClient: ManniWatchApiClient): express.Router => {
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
            prom.validateRequest({ query: passagesSchema }),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                prom.promiseToResponse(apiClient.getStopPassages(req.params.id,
                    req.query.mode,
                    req.query.startTime,
                    req.query.timeFrame), res, next);
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
