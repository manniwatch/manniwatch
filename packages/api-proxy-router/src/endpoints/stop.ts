/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { TrapezeApiClient } from '@manniwatch/api-client';
import * as express from 'express';
import { promiseToResponse } from '../promise-to-response';

export class StopEndpoints {
    public static createStopInfoEndpoint(client: TrapezeApiClient): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            promiseToResponse(client.getStopInfo(req.params.id), undefined as any, res, next);
        };
    }
    public static createStopDeparturesEndpoint(client: TrapezeApiClient): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            promiseToResponse(client.getStopPassages(req.params.id), undefined as any, res, next);
        };
    }
}
