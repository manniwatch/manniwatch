/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-server
 */

import express from 'express';

export const api404Handler: express.RequestHandler = (req: express.Request,
    res: express.Response,
    next: express.NextFunction): void => {
    res.status(404).json({
        statusCode: 404,
    });
};
