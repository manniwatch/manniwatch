/**
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { ITripPassages, IVehiclePathInfo } from '@manniwatch/api-types';
import { expect } from 'chai';
import { strict as esmock } from 'esmock';
import express from 'express';
import 'mocha';
import sinon from 'sinon';
import supertest from 'supertest';
import {
    createTestErrorRequestHandler,
    ErrorSpy,
    NOT_FOUND_RESPONSE,
    NOT_FOUND_RESPONSE_LENGTH,
    SUCCESS_RESPONSE,
    SUCCESS_RESPONSE_LENGTH,
    ValidateRequestStub,
} from './common-test.spec.js';
const testIds: string[] = ['-12883', 'kasd'];
/* eslint-disable @typescript-eslint/no-explicit-any, mocha/no-setup-in-describe */
describe('endpoints/trip.ts', function (): void {
    describe('createTripRouter', function (): void {
        let app: express.Express;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        let validateStub: ValidateRequestStub;
        let validateStubHandler: sinon.SinonStub;
        let sandbox: sinon.SinonSandbox;
        let errorSpy: ErrorSpy;
        let createTripRouter: (apiClient: ManniWatchApiClient) => express.Router;

        before(async function (): Promise<void> {
            sandbox = sinon.createSandbox();
            validateStub = sandbox.stub();
            errorSpy = sandbox.spy() as ErrorSpy;
            apiClientStub = sandbox.createStubInstance(ManniWatchApiClient);

            createTripRouter = (
                await esmock('./trip.js', {
                    '@donmahallem/turbo-validate-request': {
                        validateRequest: validateStub,
                    },
                })
            ).createTripRouter;
        });

        beforeEach(function (): void {
            validateStubHandler = sandbox.stub();
            validateStub.returns(validateStubHandler);
            const route: express.Router = createTripRouter(apiClientStub);
            app = express();
            app.use('/trip', route);
            app.use(createTestErrorRequestHandler(errorSpy));
        });

        afterEach('test and reset promise stub', function (): void {
            sandbox.reset();
        });

        after(function (): void {
            sandbox.restore();
        });
        testIds.forEach((testId: string): void => {
            describe(`query '/trip/${testId}/route'`, function (): void {
                it('should pass on the provided parameters', async function (): Promise<void> {
                    apiClientStub.getRouteByTripId.resolves(SUCCESS_RESPONSE as IVehiclePathInfo);
                    return supertest(app)
                        .get(`/trip/${testId}/route`)
                        .expect('Content-Type', /json/)
                        .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                        .expect(200, SUCCESS_RESPONSE)
                        .then((): void => {
                            expect(apiClientStub.getRouteByTripId.callCount).to.equal(1, 'getSettings should only be called once');
                            expect(apiClientStub.getRouteByTripId.getCall(0).args).to.deep.equal([testId]);
                        });
                });
            });
        });

        describe(`query '/trip/:id/passages'`, function (): void {
            afterEach(function (): void {
                expect(validateStubHandler.callCount).to.equal(1, 'should be called once');
                expect(apiClientStub.getStopInfo.callCount).to.equal(0, 'getStopInfo should not be called');
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
                    const queryUrl = `/trip/${testId}/passages`;
                    it(`should query '${queryUrl}'`, async function (): Promise<void> {
                        apiClientStub.getTripPassages.resolves(SUCCESS_RESPONSE as ITripPassages);
                        return supertest(app)
                            .get(queryUrl)
                            .expect('Content-Type', /json/)
                            .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                            .expect(200, SUCCESS_RESPONSE)
                            .then((): void => {
                                expect(apiClientStub.getTripPassages.callCount).to.equal(1, 'getTripPassages should only be called once');
                                expect(apiClientStub.getTripPassages.getCall(0).args).to.deep.equal([testId, 'departure']);
                            });
                    });
                    ['departure', 'arrival'].forEach((testMode: string): void => {
                        const queryUrlWithParam = `${queryUrl}?mode=${testMode}`;
                        it(`should query '${queryUrlWithParam}'`, async function (): Promise<void> {
                            apiClientStub.getTripPassages.resolves(SUCCESS_RESPONSE as ITripPassages);
                            return supertest(app)
                                .get(queryUrlWithParam)
                                .expect('Content-Type', /json/)
                                .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                                .expect(200, SUCCESS_RESPONSE)
                                .then((): void => {
                                    expect(apiClientStub.getTripPassages.callCount).to.equal(
                                        1,
                                        'getTripPassages should only be called once'
                                    );
                                    expect(apiClientStub.getTripPassages.getCall(0).args).to.deep.equal([testId, testMode]);
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
                    expect(errorSpy.callCount).to.equal(1, 'one route error should occur');
                    expect(errorSpy.getCall(0).args).to.deep.equal([testError]);
                });
                testIds.forEach((testId: string): void => {
                    const queryUrl = `/trip/${testId}/passages`;
                    it(`should query '${queryUrl}'`, async function (): Promise<void> {
                        apiClientStub.getTripPassages.resolves(SUCCESS_RESPONSE as ITripPassages);
                        return supertest(app)
                            .get(queryUrl)
                            .expect('Content-Type', /json/)
                            .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                            .expect(200, NOT_FOUND_RESPONSE)
                            .then((): void => {
                                expect(apiClientStub.getTripPassages.callCount).to.equal(0, 'getTripPassages should not be called');
                            });
                    });
                });
            });
        });
    });
});
