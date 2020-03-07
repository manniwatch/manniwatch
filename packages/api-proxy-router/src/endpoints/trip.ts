/*!
 * Source https://github.com/manniwatch/trapeze Package: trapeze-api-proxy-router
 */

import { TrapezeApiClient } from '@manniwatch/trapeze-api-client';
import * as express from 'express';
import { promiseToResponse } from '../promise-to-response';

export class TripEndpoints {
    public static createTripRouteEndpoint(client: TrapezeApiClient): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            promiseToResponse(client.getRouteByTripId(req.params.id), undefined as any, res, next);
        };
    }
}
