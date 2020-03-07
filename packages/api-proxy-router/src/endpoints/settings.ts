/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { TrapezeApiClient } from '@manniwatch/api-client';
import * as express from 'express';
import { promiseToResponse } from '../promise-to-response';

export class SettingsEndpoints {
    public static createSettingsEndpoint(client: TrapezeApiClient): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            promiseToResponse(client.getSettings(), undefined as any, res, next);
        };
    }
}
