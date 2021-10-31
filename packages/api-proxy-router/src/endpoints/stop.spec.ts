/*
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import * as prom from '@donmahallem/turbo';
import * as turboval from '@donmahallem/turbo-validate-request';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { STOP_PASSAGES_SCHEMA } from '@manniwatch/schemas';
import { expect } from 'chai';
import express from 'express';
import 'mocha';
import proxyquire from 'proxyquire';
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
} from './common-test.spec';
const testIds: string[] = ['-12883', 'kasd'];
/* eslint-disable @typescript-eslint/no-explicit-any */
describe('endpoints/stop.ts', (): void => {
    describe('createStopRouter', (): void => {
        let app: express.Express;
        let promiseStub: sinon.SinonStub;
        let getStopInfoStub: sinon.SinonStub<Parameters<ManniWatchApiClient['getStopInfo']>>;
        let getStopPassagesStub: sinon.SinonStub<Parameters<ManniWatchApiClient['getStopPassages']>>;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        let validateStub: sinon.SinonStub;
        let validateStubHandler: sinon.SinonStub;
        let errorSpy: ErrorSpy;
        let createStopRouter: (apiClient: ManniWatchApiClient) => express.Router;
        before((): void => {
            validateStub = sinon.stub(turboval, 'validateRequest');
            promiseStub = sinon.stub(prom, 'promiseToResponse');
            getStopInfoStub = sinon.stub();
            getStopPassagesStub = sinon.stub();
            validateStubHandler = sinon.stub();
            errorSpy = sinon.spy() as ErrorSpy;
            apiClientStub = sinon.createStubInstance(ManniWatchApiClient, {
                getStopInfo: getStopInfoStub,
                getStopPassages: getStopPassagesStub,
            });
            validateStub.returns(validateStubHandler);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            createStopRouter = proxyquire('./stop', {
                '@donmahallem/turbo': {
                    promiseToResponse: promiseStub,
                },
                '@donmahallem/turbo-validate-request': {
                    validateRequest: validateStub,
                },
            }).createStopRouter;
        });

        beforeEach((): void => {
            const route: express.Router = createStopRouter(apiClientStub);
            app = express();
            app.use('/stop', route);
            app.use(createTestErrorRequestHandler(errorSpy));
        });
        afterEach('test and reset promise stub', (): void => {
            expect(validateStub.callCount).to.equal(1, 'validateRequest should be called once');
            expect(validateStub.args[0]).to.deep.equal(['query', STOP_PASSAGES_SCHEMA], 'should be called with correct schema');
            promiseStub.resetHistory();
            getStopInfoStub.reset();
            getStopPassagesStub.reset();
            validateStubHandler.reset();
            validateStub.resetHistory();
            errorSpy.resetHistory();
        });
        after((): void => {
            promiseStub.restore();
            validateStub.restore();
        });
        describe("query '/stop/:id/route'", (): void => {
            afterEach((): void => {
                expect(promiseStub.callCount).to.equal(1);
                expect(errorSpy.callCount).to.equal(0, 'No route error should occur');
            });
            testIds.forEach((testId: string): void => {
                const queryUrl = `/stop/${testId}/info`;
                it(`should query '${queryUrl}'`, (): Promise<void> => {
                    getStopInfoStub.resolves(SUCCESS_RESPONSE);
                    promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                        source
                            .then((responseObject: any): void => {
                                res.json(responseObject);
                            })
                            .catch(next);
                    });
                    return supertest(app)
                        .get(queryUrl)
                        .expect('Content-Type', /json/)
                        .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                        .expect(200, SUCCESS_RESPONSE)
                        .then((): void => {
                            expect(apiClientStub.getStopInfo.callCount).to.equal(1, 'getStopInfo should only be called once');
                            expect(apiClientStub.getStopInfo.getCall(0).args).to.deep.equal([testId]);
                            expect(apiClientStub.getStopPassages.callCount).to.equal(0, 'getStopPassages should not be called');
                            expect(validateStubHandler.callCount).to.equal(0, 'should not be called');
                        });
                });
            });
        });
        describe(`query '/stop/:id/passages'`, (): void => {
            afterEach((): void => {
                expect(validateStubHandler.callCount).to.equal(1, 'should be called once');
                expect(apiClientStub.getStopInfo.callCount).to.equal(0, 'getStopInfo should not be called');
            });
            describe('query validation passes', (): void => {
                beforeEach((): void => {
                    validateStubHandler.callsFake((...args: any[]): void => {
                        // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                        args[2]();
                    });
                });
                afterEach((): void => {
                    expect(errorSpy.callCount).to.equal(0, 'no route error should occur');
                });
                testIds.forEach((testId: string): void => {
                    const queryUrl = `/stop/${testId}/passages`;
                    it(`should query '${queryUrl}'`, (): Promise<void> => {
                        getStopPassagesStub.resolves(SUCCESS_RESPONSE);
                        promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                            source
                                .then((responseObject: any): void => {
                                    res.json(responseObject);
                                })
                                .catch(next);
                        });
                        return supertest(app)
                            .get(queryUrl)
                            .expect('Content-Type', /json/)
                            .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                            .expect(200, SUCCESS_RESPONSE)
                            .then((): void => {
                                expect(apiClientStub.getStopPassages.callCount).to.equal(1, 'getStopPassages should only be called once');
                                expect(apiClientStub.getStopPassages.getCall(0).args).to.deep.equal([
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
                                it(`should query '${queryPath}'`, (): Promise<void> => {
                                    getStopPassagesStub.resolves(SUCCESS_RESPONSE);
                                    promiseStub.callsFake(
                                        (source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                                            source
                                                .then((responseObject: any): void => {
                                                    res.json(responseObject);
                                                })
                                                .catch(next);
                                        }
                                    );
                                    return supertest(app)
                                        .get(queryPath)
                                        .expect('Content-Type', /json/)
                                        .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                                        .expect(200, SUCCESS_RESPONSE)
                                        .then((): void => {
                                            expect(apiClientStub.getStopPassages.callCount).to.equal(
                                                1,
                                                'getStopPassages should only be called once'
                                            );
                                            expect(apiClientStub.getStopPassages.getCall(0).args).to.deep.equal([
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
            describe('query validation does not pass', (): void => {
                const testError: Error = new Error('test error');
                beforeEach((): void => {
                    validateStubHandler.callsFake((...args: any[]): void => {
                        // eslint-disable-next-line  @typescript-eslint/no-unsafe-call
                        args[2](testError);
                    });
                });
                afterEach((): void => {
                    expect(errorSpy.callCount).to.equal(1, 'one route error should occur');
                    expect(errorSpy.getCall(0).args).to.deep.equal([testError]);
                });
                testIds.forEach((testId: string): void => {
                    const queryUrl = `/stop/${testId}/passages`;
                    it(`should query '${queryUrl}'`, (): Promise<void> => {
                        getStopPassagesStub.resolves(SUCCESS_RESPONSE);
                        promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                            source
                                .then((responseObject: any): void => {
                                    res.json(responseObject);
                                })
                                .catch(next);
                        });
                        return supertest(app)
                            .get(queryUrl)
                            .expect('Content-Type', /json/)
                            .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                            .expect(200, NOT_FOUND_RESPONSE)
                            .then((): void => {
                                expect(apiClientStub.getStopPassages.callCount).to.equal(0, 'getStopPassages should not be called');
                            });
                    });
                });
            });
        });
    });
});
