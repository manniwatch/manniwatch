/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { promiseToResponse } from '@manniwatch/express-utils';
import * as express from 'express';

export class SettingsEndpoints {
    public static createSettingsEndpoint(client: ManniWatchApiClient): express.RequestHandler {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            promiseToResponse(client.getSettings(), res, next);
        };
    }
}
