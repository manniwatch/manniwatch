/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/api-proxy-router
*/

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { StopMode } from '@manniwatch/api-types';
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
export const createStopPointRouter: (apiClient: ManniWatchApiClient) => express.Router =
    (apiClient: ManniWatchApiClient): express.Router => {
        const router: express.Router = express.Router();
        /**
         * @api {get} /stopPoint/:id/passages Request StopPoint Passages
         * @apiName GetStopPointPassages
         * @apiGroup Stop
         *
         * @apiParam {String} id Stop id
         * @apiParam {String} [mode="arrival","departure"]
         * @apiParam {String} [startTime]
         * @apiParam {String} [timeFrame]
         * @apiVersion 0.6.0
         */
        // eslint-disable-next-line no-useless-escape
        router.get('/:id([a-z0-9A-Z\-\+]+)/passages',
            prom.validateRequest({ query: passagesSchema }),
            (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                const mode: StopMode = req.query.mode as StopMode || undefined;
                // eslint-disable-next-line eqeqeq
                const startTime: number | undefined = req.query.startTime == undefined ?
                    undefined :
                    parseInt(req.query.startTime as string, 10);
                // eslint-disable-next-line eqeqeq
                const timeFrame: number | undefined = req.query.timeFrame == undefined ?
                    undefined :
                    parseInt(req.query.timeFrame as string, 10);
                prom.promiseToResponse(apiClient.getStopPointPassages(req.params.id,
                    mode,
                    startTime,
                    timeFrame), res, next);
            });
        /**
         * @api {get} /stopPoint/:id/info Request stop point info
         * @apiName StopPointInfo
         * @apiGroup StopPoint
         *
         * @apiParam {String} id Stop Point ID
         * @apiVersion 1.5.0
         */
        // eslint-disable-next-line no-useless-escape
        router.get('/:id([a-z0-9A-Z\-\+]+)/info', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            prom.promiseToResponse(apiClient.getStopPointInfo(req.params.id), res, next);
        });
        return router;
    };
