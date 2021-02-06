/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { expect } from 'chai';
import * as express from 'express';
import 'mocha';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import {
    createTestErrorRequestHandler,
    NOT_FOUND_RESPONSE,
    NOT_FOUND_RESPONSE_LENGTH,
    SUCCESS_RESPONSE,
    SUCCESS_RESPONSE_LENGTH,
} from './common-test.spec';
const testIds: string[] = ['-12883', 'kasd'];
describe('endpoints/trip.ts', (): void => {
    describe('createTripRouter', (): void => {
        let app: express.Express;
        let promiseStub: sinon.SinonStub;
        let getRouteByTripIdStub: sinon.SinonStub;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        let validateStub: sinon.SinonStub;
        let validateStubHandler: sinon.SinonStub;
        let sandbox: sinon.SinonSandbox;
        let errorSpy: sinon.SinonSpy;
        let createTripRouter: any;
        before((): void => {
            sandbox = sinon.createSandbox();
            promiseStub = sandbox.stub();
            validateStub = sandbox.stub();
            getRouteByTripIdStub = sinon.stub();
            errorSpy = sandbox.spy();
            apiClientStub = sandbox.createStubInstance(ManniWatchApiClient, {
                getRouteByTripId: getRouteByTripIdStub as any,
            });
            createTripRouter = proxyquire('./trip', {
                '@manniwatch/express-utils': {
                    promiseToResponse: promiseStub,
                    validateRequest: validateStub,
                },
            }).createTripRouter;
        });

        beforeEach((): void => {
            validateStubHandler = sandbox.stub();
            validateStub.returns(validateStubHandler);
            const route: express.Router = createTripRouter(apiClientStub as any);
            app = express();
            app.use('/trip', route);
            app.use(createTestErrorRequestHandler(errorSpy));
        });
        afterEach('test and reset promise stub', (): void => {
            sandbox.reset();
        });
        after((): void => {
            sandbox.restore();
        });
        testIds.forEach((testId: string): void => {
            describe('query \'/trip/' + testId + '/route\'', (): void => {
                it('should pass on the provided parameters', (): Promise<void> => {
                    getRouteByTripIdStub.resolves(SUCCESS_RESPONSE);
                    promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                        source
                            .then((responseObject: any): void => {
                                res.json(responseObject);
                            });
                    });
                    return supertest(app)
                        .get(`/trip/${testId}/route`)
                        .expect('Content-Type', /json/)
                        .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                        .expect(200, SUCCESS_RESPONSE)
                        .then((res: supertest.Response): void => {
                            expect(apiClientStub.getRouteByTripId.callCount)
                                .to.equal(1, 'getSettings should only be called once');
                            expect(apiClientStub.getRouteByTripId.getCall(0).args)
                                .to.deep.equal([testId]);
                        });
                });
            });
        });
        describe('query \'/trip/:id/passages\'', (): void => {
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
                    const queryUrl: string = `/trip/${testId}/passages`;
                    it(`should query \'${queryUrl}\'`, (): Promise<void> => {
                        apiClientStub.getTripPassages.resolves(SUCCESS_RESPONSE);
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
                                expect(apiClientStub.getTripPassages.callCount)
                                    .to.equal(1, 'getTripPassages should only be called once');
                                expect(apiClientStub.getTripPassages.getCall(0).args)
                                    .to.deep.equal([testId, 'departure']);
                            });
                    });
                    ['departure', 'arrival'].forEach((testMode: string): void => {
                        const queryUrlWithParam: string = queryUrl + '?mode=' + testMode;
                        it(`should query \'${queryUrlWithParam}\'`, (): Promise<void> => {
                            apiClientStub.getTripPassages.resolves(SUCCESS_RESPONSE);
                            promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                                source
                                    .then((responseObject: any): void => {
                                        res.json(responseObject);
                                    });
                            });
                            return supertest(app)
                                .get(queryUrlWithParam)
                                .expect('Content-Type', /json/)
                                .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                                .expect(200, SUCCESS_RESPONSE)
                                .then((res: supertest.Response): void => {
                                    expect(apiClientStub.getTripPassages.callCount)
                                        .to.equal(1, 'getTripPassages should only be called once');
                                    expect(apiClientStub.getTripPassages.getCall(0).args)
                                        .to.deep.equal([testId, testMode]);
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
                    const queryUrl: string = `/trip/${testId}/passages`;
                    it(`should query \'${queryUrl}\'`, (): Promise<void> => {
                        apiClientStub.getTripPassages.resolves(SUCCESS_RESPONSE);
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
                                expect(apiClientStub.getTripPassages.callCount)
                                    .to.equal(0, 'getTripPassages should not be called');
                            });
                    });
                });
            });
        });
    });
});
