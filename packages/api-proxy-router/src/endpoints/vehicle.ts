/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import * as express from 'express';
import { promiseToResponse } from '../promise-to-response';

export class VehicleEndpoints {
    public static createVehicleInfoEndpoint(client: ManniWatchApiClient): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            promiseToResponse(client.getRouteByVehicleId(req.params.id), res, next);
        };
    }
}
