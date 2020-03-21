/*!
 * Source https://github.com/manniwatch/manniwatch Package: express-utils
 */

import { NextFunction, Response } from 'express';
import { FullResponse, RequestPromise } from 'request-promise-native';

type MethodType = <T>(prom: Promise<T> | RequestPromise<T>,
    res: Response,
    next?: NextFunction) => void;
/**
 * takes promises and passes them on to an express response
 */
export const promiseToResponse: MethodType = <T>(prom: Promise<T> | RequestPromise<T>,
    res: Response,
    next?: NextFunction): void => {
    prom
        .then((value: T): void => {
            res.status(200).json(value);
        })
        .catch((err: any | FullResponse): void => {
            if (next) {
                next(err);
            } else {
                const code: number = err.statusCode || 500;
                res.status(code).json({
                    error: true,
                    statusCode: code,
                });
            }
        });
};
