/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-server
 */

import express from 'express';

/**
 * Common error catcher
 */
export const serverErrorHandler: express.ErrorRequestHandler = (err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction): void => {
    // tslint:disable-next-line:no-console
    console.error(err);
    res.status(500).json({ error: true });
};
