/**
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { STOP_PASSAGES_SCHEMA } from '@manniwatch/schemas';
import { expect } from 'chai';
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
} from './common-test.spec.js';
import { ValidateRequestStub } from './common-test.spec.js';
const testIds: string[] = ['-12883', 'kasd'];

/* eslint-disable @typescript-eslint/no-explicit-any, mocha/no-setup-in-describe */
describe('endpoints/stop-point.ts', function (): void {
    describe('createStopPointRouter', function (): void {
        let app: express.Express;
        let getStopPointInfoStub: sinon.SinonStub<Parameters<ManniWatchApiClient['getStopPointInfo']>>;
        let getStopPointPassagesStub: sinon.SinonStub<Parameters<ManniWatchApiClient['getStopPointPassages']>>;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        let validateStub: ValidateRequestStub;
        let validateStubHandler: sinon.SinonStub;
        let errorSpy: ErrorSpy;
        let createStopPointRouter: (apiClient: ManniWatchApiClient) => express.Router;

        before(async function (): Promise<void> {
            validateStub = sinon.stub().named('validateRequest') as ValidateRequestStub;
            getStopPointInfoStub = sinon.stub();
            getStopPointPassagesStub = sinon.stub();
            validateStubHandler = sinon.stub();
            errorSpy = sinon.spy() as ErrorSpy;
            apiClientStub = sinon.createStubInstance(ManniWatchApiClient, {
                getStopPointInfo: getStopPointInfoStub,
                getStopPointPassages: getStopPointPassagesStub,
            });
            validateStub.returns(validateStubHandler);

            createStopPointRouter = (
                await esmock('./stop-point.js', {
                    '@donmahallem/turbo-validate-request': {
                        validateRequest: validateStub,
                    },
                })
            ).createStopPointRouter;
        });

        beforeEach(function (): void {
            const route: express.Router = createStopPointRouter(apiClientStub);
            app = express();
            app.use('/stopPoint', route);
            app.use(createTestErrorRequestHandler(errorSpy));
        });

        afterEach('test and reset promise stub', function (): void {
            expect(validateStub.callCount).to.equal(1, 'validateRequest should be called once');
            expect(validateStub.args[0]).to.deep.equal(['query', STOP_PASSAGES_SCHEMA], 'should be called with correct schema');
            getStopPointInfoStub.reset();
            getStopPointPassagesStub.reset();
            validateStubHandler.reset();
            validateStub.resetHistory();
            errorSpy.resetHistory();
        });

        describe(`query '/stopPoint/:id/route'`, function (): void {
            afterEach(function (): void {
                expect(errorSpy.callCount).to.equal(0, 'No route error should occur');
            });
            testIds.forEach((testId: string): void => {
                const queryUrl = `/stopPoint/${testId}/info`;
                it(`should query '${queryUrl}'`, async function (): Promise<void> {
                    getStopPointInfoStub.resolves(SUCCESS_RESPONSE);
                    return supertest(app)
                        .get(queryUrl)
                        .expect('Content-Type', /json/)
                        .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                        .expect(200, SUCCESS_RESPONSE)
                        .then((): void => {
                            expect(apiClientStub.getStopPointInfo.callCount).to.equal(1, 'getStopPointInfo should only be called once');
                            expect(apiClientStub.getStopPointInfo.getCall(0).args).to.deep.equal([testId]);
                            expect(apiClientStub.getStopPointPassages.callCount).to.equal(0, 'getStopPointPassages should not be called');
                            expect(validateStubHandler.callCount).to.equal(0, 'should not be called');
                        });
                });
            });
        });

        describe(`query '/stopPoint/:id/passages'`, function (): void {
            afterEach(function (): void {
                expect(validateStubHandler.callCount).to.equal(1, 'should be called once');
                expect(apiClientStub.getStopPointInfo.callCount).to.equal(0, 'getStopPointInfo should not be called');
            });

            describe('query validation passes', function (): void {
                beforeEach(function (): void {
                    validateStubHandler.callsFake((...args: any[]): void => {
                        args[2]();
                    });
                });

                afterEach(function (): void {
                    expect(errorSpy.callCount).to.equal(0, 'no route error should occur');
                });
                testIds.forEach((testId: string): void => {
                    const queryUrl = `/stopPoint/${testId}/passages`;
                    it(`should query '${queryUrl}'`, async function (): Promise<void> {
                        getStopPointPassagesStub.resolves(SUCCESS_RESPONSE);
                        return supertest(app)
                            .get(queryUrl)
                            .expect('Content-Type', /json/)
                            .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                            .expect(200, SUCCESS_RESPONSE)
                            .then((): void => {
                                expect(apiClientStub.getStopPointPassages.callCount).to.equal(
                                    1,
                                    'getStopPointPassages should only be called once'
                                );
                                expect(apiClientStub.getStopPointPassages.getCall(0).args).to.deep.equal([
                                    testId,
                                    undefined,
                                    undefined,
                                    undefined,
                                ]);
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
                                    getStopPointPassagesStub.resolves(SUCCESS_RESPONSE);
                                    return supertest(app)
                                        .get(queryPath)
                                        .expect('Content-Type', /json/)
                                        .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                                        .then((): void => {
                                            expect(apiClientStub.getStopPointPassages.callCount).to.equal(
                                                1,
                                                'getStopPointPassages should only be called once'
                                            );
                                            expect(apiClientStub.getStopPointPassages.getCall(0).args).to.deep.equal([
                                                testId,
                                                testStopMode,
                                                testStartTime,
                                                testTimeFrame,
                                            ]);
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
                    console.info(validateStub);
                });

                afterEach(function (): void {
                    expect(errorSpy.callCount).to.equal(1, 'one route error should occur');
                    expect(errorSpy.getCall(0).args).to.deep.equal([testError]);
                });
                testIds.forEach((testId: string): void => {
                    const queryUrl = `/stopPoint/${testId}/passages`;
                    it(`should query '${queryUrl}'`, async function (): Promise<void> {
                        getStopPointPassagesStub.resolves(SUCCESS_RESPONSE);
                        await supertest(app)
                            .get(queryUrl)
                            .expect('Content-Type', /json/)
                            .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                            .expect(200, NOT_FOUND_RESPONSE)
                            .then((): void => {
                                expect(apiClientStub.getStopPointPassages.callCount).to.equal(
                                    0,
                                    'getStopPointPassages should not be called'
                                );
                            });
                    });
                });
            });
        });
    });
});
