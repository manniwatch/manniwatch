/**
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { IStopInfo, IStopPassage, StopMode } from '@manniwatch/api-types';
import { STOP_PASSAGES_SCHEMA } from '@manniwatch/schemas';
import { strict as esmock } from 'esmock';
import express from 'express';
import 'mocha';
import sinon from 'sinon';
import supertest from 'supertest';
import {
    createTestErrorRequestHandler,
    testStopModes,
    NOT_FOUND_RESPONSE,
    NOT_FOUND_RESPONSE_LENGTH,
    SUCCESS_RESPONSE,
    SUCCESS_RESPONSE_LENGTH,
    ErrorSpy,
    ValidateRequestStub,
    MethodStub,
} from './common-test.spec.js';
import type { createStopRouter } from './stop.js';
const testIds: string[] = ['-12883', 'kasd'];
type GetStopPassagesStub = MethodStub<ManniWatchApiClient['getStopPassages']>;
type GetStopInfoStub = MethodStub<ManniWatchApiClient['getStopInfo']>;
/* eslint-disable @typescript-eslint/no-explicit-any, mocha/no-setup-in-describe */
describe('endpoints/stop.ts', function (): void {
    describe('createStopRouter', function (): void {
        let app: express.Express;
        let getStopInfoStub: GetStopInfoStub;
        let getStopPassagesStub: GetStopPassagesStub;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        let validateStub: ValidateRequestStub;
        let validateStubHandler: sinon.SinonStub;
        let errorSpy: ErrorSpy;
        let createStopRouterMethod: typeof createStopRouter;

        before(async function (): Promise<void> {
            validateStub = sinon.stub().named('validateRequest') as ValidateRequestStub;
            getStopInfoStub = sinon.stub().named('ManniWatchApiClient.getStopInfo') as GetStopInfoStub;
            getStopPassagesStub = sinon.stub().named('ManniWatchApiClient.getStopPassages') as GetStopPassagesStub;
            validateStubHandler = sinon.stub().named('validateRequestStub');
            errorSpy = sinon.spy() as ErrorSpy;
            apiClientStub = sinon.createStubInstance(ManniWatchApiClient, {
                getStopInfo: getStopInfoStub,
                getStopPassages: getStopPassagesStub,
            });
            validateStub.returns(validateStubHandler);

            createStopRouterMethod = (
                await esmock('./stop.js', {
                    '@donmahallem/turbo-validate-request': {
                        validateRequest: validateStub,
                    },
                })
            ).createStopRouter;
        });

        beforeEach(function () {
            const route: express.Router = createStopRouterMethod(apiClientStub);
            app = express();
            app.use('/stop', route);
            app.use(createTestErrorRequestHandler(errorSpy));
        });

        afterEach('test and reset promise stub', function (): void {
            getStopInfoStub.reset();
            getStopPassagesStub.reset();
            validateStubHandler.reset();
            validateStub.resetHistory();
            errorSpy.resetHistory();
        });

        describe(`query '/stop/:id/info'`, function (): void {
            afterEach(function (): void {
                sinon.assert.notCalled(errorSpy);
                sinon.assert.notCalled(validateStubHandler);
                sinon.assert.notCalled(apiClientStub.getStopPassages);
            });
            testIds.forEach((testId: string): void => {
                const queryUrl = `/stop/${testId}/info`;
                it(`should query '${queryUrl}'`, async function (): Promise<void> {
                    getStopInfoStub.resolves(SUCCESS_RESPONSE as IStopInfo);
                    return supertest(app)
                        .get(queryUrl)
                        .expect('Content-Type', /json/)
                        .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                        .expect(200, SUCCESS_RESPONSE)
                        .then((): void => {
                            sinon.assert.calledOnceWithExactly(apiClientStub.getStopInfo, testId);
                        });
                });
            });
        });

        describe(`query '/stop/:id/passages'`, function (): void {
            afterEach(function (): void {
                sinon.assert.calledOnceWithExactly(validateStub, 'query', STOP_PASSAGES_SCHEMA as any);
                sinon.assert.calledOnce(validateStubHandler);
                sinon.assert.notCalled(apiClientStub.getStopInfo);
            });

            describe('query validation passes', function (): void {
                beforeEach(function (): void {
                    validateStubHandler.callsFake((...args: any[]): void => {
                        args[2]();
                    });
                });

                afterEach(function (): void {
                    sinon.assert.notCalled(errorSpy);
                });
                testIds.forEach((testId: string): void => {
                    const queryUrl = `/stop/${testId}/passages`;
                    it(`should query '${queryUrl}'`, async function (): Promise<void> {
                        getStopPassagesStub.resolves(SUCCESS_RESPONSE as IStopPassage);
                        return supertest(app)
                            .get(queryUrl)
                            .expect('Content-Type', /json/)
                            .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                            .expect(200, SUCCESS_RESPONSE)
                            .then((): void => {
                                sinon.assert.calledOnceWithExactly(apiClientStub.getStopPassages, testId, undefined, undefined, undefined);
                            });
                    });
                    testStopModes.forEach((testStopMode?: string): void => {
                        [undefined, 20, 3948].forEach((testStartTime: number | undefined): void => {
                            [undefined, 842, 128].forEach((testTimeFrame: number | undefined): void => {
                                let queryPath = `${queryUrl}?`;
                                if (testStopMode) {
                                    queryPath += `mode=${testStopMode}&`;
                                }
                                if (testStartTime) {
                                    queryPath += `startTime=${testStartTime}&`;
                                }
                                if (testTimeFrame) {
                                    queryPath += `timeFrame=${testTimeFrame}&`;
                                }
                                it(`should query '${queryPath}'`, async function (): Promise<void> {
                                    getStopPassagesStub.resolves(SUCCESS_RESPONSE as IStopPassage);
                                    return supertest(app)
                                        .get(queryPath)
                                        .expect('Content-Type', /json/)
                                        .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                                        .expect(200, SUCCESS_RESPONSE)
                                        .then((): void => {
                                            sinon.assert.calledOnceWithExactly(
                                                apiClientStub.getStopPassages,
                                                testId,
                                                testStopMode as StopMode,
                                                testStartTime,
                                                testTimeFrame
                                            );
                                        });
                                });
                            });
                        });
                    });
                });
            });

            describe('query validation does not pass', function (): void {
                const testError: Error = new Error('test error');

                beforeEach(function (): void {
                    validateStubHandler.callsFake((...args: any[]): void => {
                        args[2](testError);
                    });
                });

                afterEach(function (): void {
                    sinon.assert.calledOnceWithExactly(errorSpy, testError);
                    sinon.assert.notCalled(apiClientStub.getStopPassages);
                });
                testIds.forEach((testId: string): void => {
                    const queryUrl = `/stop/${testId}/passages`;
                    it(`should query '${queryUrl}'`, async function (): Promise<supertest.Test> {
                        getStopPassagesStub.resolves(SUCCESS_RESPONSE as IStopPassage);
                        return supertest(app)
                            .get(queryUrl)
                            .expect(200, NOT_FOUND_RESPONSE)
                            .expect('Content-Type', /json/)
                            .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH);
                    });
                });
            });
        });
    });
});
