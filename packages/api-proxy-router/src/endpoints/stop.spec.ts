/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import * as prom from '@manniwatch/express-utils';
import { expect } from 'chai';
import * as express from 'express';
import 'mocha';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import {
    createTestErrorRequestHandler,
    testStopModes,
    NOT_FOUND_RESPONSE,
    NOT_FOUND_RESPONSE_LENGTH,
    SUCCESS_RESPONSE,
    SUCCESS_RESPONSE_LENGTH,
} from './common-test.spec';
import { createStopRouter, passagesSchema } from './stop';
const testIds: string[] = ['-12883', 'kasd'];
describe('endpoints/stop.ts', (): void => {
    describe('createTripRouter', (): void => {
        let app: express.Express;
        let promiseStub: sinon.SinonStub;
        let getStopInfoStub: sinon.SinonStub;
        let getStopPassagesStub: sinon.SinonStub;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        let validateStub: sinon.SinonStub;
        let validateStubHandler: sinon.SinonStub;
        let errorSpy: sinon.SinonSpy;
        before((): void => {
            validateStub = sinon.stub(prom, 'validateRequest');
            promiseStub = sinon.stub(prom, 'promiseToResponse');
            getStopInfoStub = sinon.stub();
            getStopPassagesStub = sinon.stub();
            validateStubHandler = sinon.stub();
            errorSpy = sinon.spy();
            apiClientStub = sinon.createStubInstance(ManniWatchApiClient, {
                getStopInfo: getStopInfoStub as any,
                getStopPassages: getStopPassagesStub as any,
            });
            validateStub.returns(validateStubHandler);
        });

        beforeEach((): void => {
            const route: express.Router = createStopRouter(apiClientStub as any);
            app = express();
            app.use('/stop', route);
            app.use(createTestErrorRequestHandler(errorSpy));
        });
        afterEach('test and reset promise stub', (): void => {
            expect(validateStub.callCount).to.equal(1, 'validateRequest should be called once');
            expect(validateStub.args[0]).to.deep.equal([{ query: passagesSchema }], 'should be called with correct schema');
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
        describe('query \'/stop/:id/route\'', (): void => {
            afterEach((): void => {
                expect(promiseStub.callCount).to.equal(1);
                expect(errorSpy.callCount).to.equal(0, 'No route error should occur');
            });
            testIds.forEach((testId: string): void => {
                const queryUrl: string = `/stop/${testId}/info`;
                it(`should query \'${queryUrl}\'`, (): Promise<void> => {
                    getStopInfoStub.resolves(SUCCESS_RESPONSE);
                    promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                        source
                            .then((responseObject: any): void => {
                                res.json(responseObject);
                            });
                    });
                    return supertest(app)
                        .get(queryUrl)
                        .expect('Content-Type', /json/)
                        .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                        .expect(200, SUCCESS_RESPONSE)
                        .then((res: supertest.Response): void => {
                            expect(apiClientStub.getStopInfo.callCount)
                                .to.equal(1, 'getStopInfo should only be called once');
                            expect(apiClientStub.getStopInfo.getCall(0).args)
                                .to.deep.equal([testId]);
                            expect(apiClientStub.getStopPassages.callCount)
                                .to.equal(0, 'getStopPassages should not be called');
                            expect(validateStubHandler.callCount).to.equal(0, 'should not be called');
                        });
                });
            });
        });
        describe('query \'/stop/:id/passages\'', (): void => {
            afterEach((): void => {
                expect(validateStubHandler.callCount).to.equal(1, 'should be called once');
                expect(apiClientStub.getStopInfo.callCount)
                    .to.equal(0, 'getStopInfo should not be called');
            });
            describe('query validation passes', (): void => {
                beforeEach((): void => {
                    validateStubHandler.callsFake((...args: any[]): void => {
                        args[2]();
                    });
                });
                afterEach((): void => {
                    expect(errorSpy.callCount).to.equal(0, 'no route error should occur');
                });
                testIds.forEach((testId: string): void => {
                    const queryUrl: string = `/stop/${testId}/passages`;
                    it(`should query \'${queryUrl}\'`, (): Promise<void> => {
                        getStopPassagesStub.resolves(SUCCESS_RESPONSE);
                        promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                            source
                                .then((responseObject: any): void => {
                                    res.json(responseObject);
                                });
                        });
                        return supertest(app)
                            .get(queryUrl)
                            .expect('Content-Type', /json/)
                            .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                            .expect(200, SUCCESS_RESPONSE)
                            .then((res: supertest.Response): void => {
                                expect(apiClientStub.getStopPassages.callCount)
                                    .to.equal(1, 'getStopPassages should only be called once');
                                expect(apiClientStub.getStopPassages.getCall(0).args)
                                    .to.deep.equal([testId, undefined, undefined, undefined]);
                            });
                    });
                    testStopModes
                        .forEach((testStopMode?: string): void => {
                            [undefined, 20, 3948]
                                .forEach((testStartTime: number | undefined): void => {
                                    [undefined, 842, 128]
                                        .forEach((testTimeFrame: number | undefined): void => {
                                            let queryPath: string = queryUrl + '?';
                                            if (testStopMode) {
                                                queryPath += 'mode=' + testStopMode + '&';
                                            }
                                            if (testStartTime) {
                                                queryPath += 'startTime=' + testStartTime + '&';
                                            }
                                            if (testTimeFrame) {
                                                queryPath += 'timeFrame=' + testTimeFrame + '&';
                                            }
                                            it(`should query \'${queryPath}\'`, (): Promise<void> => {
                                                getStopPassagesStub.resolves(SUCCESS_RESPONSE);
                                                promiseStub.callsFake((source: Promise<any>,
                                                    res: express.Response,
                                                    next: express.NextFunction): void => {
                                                    source
                                                        .then((responseObject: any): void => {
                                                            res.json(responseObject);
                                                        });
                                                });
                                                return supertest(app)
                                                    .get(queryPath)
                                                    .expect('Content-Type', /json/)
                                                    .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                                                    .expect(200, SUCCESS_RESPONSE)
                                                    .then((res: supertest.Response): void => {
                                                        expect(apiClientStub.getStopPassages.callCount)
                                                            .to.equal(1, 'getStopPassages should only be called once');
                                                        expect(apiClientStub.getStopPassages.getCall(0).args)
                                                            .to.deep.equal([testId, testStopMode, testStartTime, testTimeFrame]);
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
                        args[2](testError);
                    });
                });
                afterEach((): void => {
                    expect(errorSpy.callCount).to.equal(1, 'one route error should occur');
                    expect(errorSpy.getCall(0).args).to.deep.equal([testError]);
                });
                testIds.forEach((testId: string): void => {
                    const queryUrl: string = `/stop/${testId}/passages`;
                    it(`should query \'${queryUrl}\'`, (): Promise<void> => {
                        getStopPassagesStub.resolves(SUCCESS_RESPONSE);
                        promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                            source
                                .then((responseObject: any): void => {
                                    res.json(responseObject);
                                });
                        });
                        return supertest(app)
                            .get(queryUrl)
                            .expect('Content-Type', /json/)
                            .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                            .expect(200, NOT_FOUND_RESPONSE)
                            .then((res: supertest.Response): void => {
                                expect(apiClientStub.getStopPassages.callCount)
                                    .to.equal(0, 'getStopPassages should not be called');
                            });
                    });
                });
            });
        });
    });
});
