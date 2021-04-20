/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { StopMode } from '@manniwatch/api-types';
import express, { ErrorRequestHandler, NextFunction, Request, Response, Router } from 'express';

/**
 * @hidden
 */
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T];
/**
 * @hidden
 */
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
/**
 * @hidden
 */
export interface ITestEndpoint<K, T> {
    endpointFn: FunctionProperties<K>;
    innerMethod: FunctionPropertyNames<T>;
}

export const delayPromise: <T>(resolveValue: T, delayMs?: number) => Promise<T> =
    <T>(resolveValue: T, delayMs: number = 50): Promise<T> => {
        return new Promise<T>((resolve: (v: T) => void): void => {
            setTimeout((): void => {
                resolve(resolveValue);
            }, delayMs);
        });
    };

export const NOT_FOUND_RESPONSE: any = { error: true, status: 404 };
export const NOT_FOUND_RESPONSE_LENGTH: string = `${JSON.stringify(NOT_FOUND_RESPONSE).length}`;
export const SUCCESS_RESPONSE: any = { error: false, status: 200 };
export const SUCCESS_RESPONSE_LENGTH: string = `${JSON.stringify(SUCCESS_RESPONSE).length}`;
export const createTestErrorRequestHandler: (innerSpy: sinon.SinonSpy) => ErrorRequestHandler =
    (innerSpy: sinon.SinonSpy): ErrorRequestHandler => {
        return (err: any, req: Request, res: Response, next: NextFunction): void => {
            innerSpy(err);
            res.json(NOT_FOUND_RESPONSE);
        };
    };

export const testStopModes: (StopMode | undefined)[] = ['arrival', 'departure', undefined];

export const createTestApp = (route: Router, errorSpy: sinon.SinonSpy): express.Application => {
    const app: express.Application = express();
    app.use(route);
    app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        res.status(404);
        res.json(NOT_FOUND_RESPONSE);
    });
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
        errorSpy(err);
        res.status(501).json(NOT_FOUND_RESPONSE);
    });
    return app;
};
