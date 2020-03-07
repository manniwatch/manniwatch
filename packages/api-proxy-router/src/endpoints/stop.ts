/*!
 * Source https://github.com/manniwatch/trapeze Package: trapeze-api-proxy-router
 */

import { TrapezeApiClient } from '@manniwatch/trapeze-api-client';
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
