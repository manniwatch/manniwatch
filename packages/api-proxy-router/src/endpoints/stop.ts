/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { StopId } from '@donmahallem/trapeze-api-types';
import * as express from 'express';
import { promiseToResponse } from '../promise-to-response';

export class StopEndpoints {
    public static createStopInfoEndpoint(client: ManniWatchApiClient): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            promiseToResponse(client.getStopInfo(req.params.id as StopId), res, next);
        };
    }
    public static createStopDeparturesEndpoint(client: ManniWatchApiClient): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            promiseToResponse(client.getStopPassages(req.params.id as StopId), res, next);
        };
    }
}
