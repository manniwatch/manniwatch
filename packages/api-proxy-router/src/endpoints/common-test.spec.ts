/*
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { StopMode } from '@manniwatch/api-types';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const delayPromise: <T>(resolveValue: T, delayMs?: number) => Promise<T> = <T>(resolveValue: T, delayMs = 50): Promise<T> => {
    return new Promise<T>((resolve: (v: T) => void): void => {
        setTimeout((): void => {
            resolve(resolveValue);
        }, delayMs);
    });
};

export const NOT_FOUND_RESPONSE: object = { error: true, status: 404 };
export const NOT_FOUND_RESPONSE_LENGTH = `${JSON.stringify(NOT_FOUND_RESPONSE).length}`;
export const SUCCESS_RESPONSE: object = { error: false, status: 200 };
export const SUCCESS_RESPONSE_LENGTH = `${JSON.stringify(SUCCESS_RESPONSE).length}`;
export type ErrorSpy = sinon.SinonSpy<[(err: any) => void], void>;
export const createTestErrorRequestHandler: (innerSpy: ErrorSpy) => ErrorRequestHandler = (
    innerSpy: sinon.SinonSpy
): ErrorRequestHandler => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (err: any, req: Request, res: Response, next: NextFunction): void => {
        innerSpy(err);
        res.json(NOT_FOUND_RESPONSE);
    };
};

export const testStopModes: (StopMode | undefined)[] = ['arrival', 'departure', undefined];

export type MethodStub<T extends (...args: any) => any> = sinon.SinonStub<Parameters<T>, ReturnType<T>>;

import type { promiseToResponse } from '@donmahallem/turbo';
import type { validateRequest } from '@donmahallem/turbo-validate-request';
export type ValidateRequestParameters = Parameters<typeof validateRequest>;
export type ValidateRequestReturnType = ReturnType<typeof validateRequest>;
export type ValidateRequestStub = sinon.SinonStub<ValidateRequestParameters, ValidateRequestReturnType>;
export type PromiseToResponseParameters = Parameters<typeof promiseToResponse>;
export type PromiseToResponseReturnType = ReturnType<typeof promiseToResponse>;
export type PromiseToResponseStub = sinon.SinonStub<PromiseToResponseParameters, PromiseToResponseReturnType>;
