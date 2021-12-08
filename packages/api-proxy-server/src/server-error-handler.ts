/*
 * Package @manniwatch/api-proxy-server
 * Source https://manniwatch.github.io/manniwatch/
 */

import express from 'express';

/**
 * Common error catcher
 *
 * @param {Error} err error
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
export const serverErrorHandler: express.ErrorRequestHandler = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    req: express.Request,
    res: express.Response
): void => {
    // tslint:disable-next-line:no-console
    console.error(err);
    res.status(500).json({ error: true });
};
