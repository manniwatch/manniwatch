/**
 * Package @manniwatch/api-proxy-server
 * Source https://manniwatch.github.io/manniwatch/
 */

import express from 'express';

export const api404Handler: express.RequestHandler = (req: express.Request, res: express.Response): void => {
    res.status(404).json({
        statusCode: 404,
    });
};
