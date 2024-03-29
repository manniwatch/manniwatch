/*
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { expect } from 'chai';
import { strict as esmock } from 'esmock';
import express from 'express';
import 'mocha';
import sinon from 'sinon';
import supertest from 'supertest';
import { PromiseToResponseStub, SUCCESS_RESPONSE, SUCCESS_RESPONSE_LENGTH } from './common-test.spec.js';
const testIds: string[] = ['-12883', 'kasd'];

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
describe('endpoints/vehicle.ts', (): void => {
    describe('createVehicleRouter', (): void => {
        let app: express.Express;
        let promiseStub: PromiseToResponseStub;
        let getRouteByVehicleIdStub: sinon.SinonStub<Parameters<ManniWatchApiClient['getRouteByVehicleId']>>;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        let createVehicleRouter: (apiClient: ManniWatchApiClient) => express.Router;
        before(async (): Promise<void> => {
            promiseStub = sinon.stub().named('promiseToResponse') as PromiseToResponseStub;
            getRouteByVehicleIdStub = sinon.stub();
            apiClientStub = sinon.createStubInstance(ManniWatchApiClient, {
                getRouteByVehicleId: getRouteByVehicleIdStub,
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            createVehicleRouter = (
                await esmock('./vehicle.js', {
                    '@donmahallem/turbo': {
                        promiseToResponse: promiseStub,
                    },
                })
            ).createVehicleRouter;
        });

        beforeEach((): void => {
            const route: express.Router = createVehicleRouter(apiClientStub);
            app = express();
            app.use('/vehicle', route);
        });
        afterEach('test and reset promise stub', (): void => {
            expect(promiseStub.callCount).to.equal(1);
            promiseStub.resetHistory();
            getRouteByVehicleIdStub.resetHistory();
        });
        testIds.forEach((testId: string): void => {
            describe(`query '/vehicle/${testId}/route'`, (): void => {
                it('should pass on the provided parameters', (): Promise<void> => {
                    getRouteByVehicleIdStub.resolves(SUCCESS_RESPONSE);
                    promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                        source
                            .then((responseObject: any): void => {
                                res.json(responseObject);
                            })
                            .catch(next);
                    });
                    return supertest(app)
                        .get(`/vehicle/${testId}/route`)
                        .expect('Content-Type', /json/)
                        .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                        .expect(200, SUCCESS_RESPONSE)
                        .then((): void => {
                            expect(apiClientStub.getRouteByVehicleId.callCount).to.equal(1, 'getSettings should only be called once');
                            expect(apiClientStub.getRouteByVehicleId.getCall(0).args).to.deep.equal([testId]);
                        });
                });
            });
        });
    });
});
