/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-server
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { createApiProxyRouter } from '@manniwatch/api-proxy-router';
import { ServerError } from '@manniwatch/express-utils';
import * as express from 'express';
export const api404Handler: express.RequestHandler = (req: express.Request,
    res: express.Response,
    next: express.NextFunction): void => {
    res.status(404).json({
        statusCode: 404,
    });
};
/**
 * Common error catcher
 */
export const serverErrorHandler: express.ErrorRequestHandler = (err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction): void => {
    // tslint:disable-next-line:no-console
    if (err instanceof ServerError || (err.statusCode && err.message)) {
        res.status(err.statusCode).json({
            error: true,
            message: err.message,
        });
    } else {
        res.status(500).json({
            error: true,
            message: 'Unspecified error occured',
        });
    }
};

export const createProxyServer: (clientOrEndpoint: ManniWatchApiClient) => express.Application =
    (clientOrEndpoint: ManniWatchApiClient): express.Application => {
        const app: express.Application = express();
        app.use('/api', createApiProxyRouter(clientOrEndpoint));
        app.use('/api', api404Handler);
        app.use(serverErrorHandler);
        return app;
    };
