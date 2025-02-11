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
import { SUCCESS_RESPONSE, SUCCESS_RESPONSE_LENGTH } from './common-test.spec.js';
const testIds: string[] = ['-12883', 'kasd'];

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-misused-promises */
describe('endpoints/vehicle.ts', (): void => {
    describe('createVehicleRouter', (): void => {
        let app: express.Express;
        let getRouteByVehicleIdStub: sinon.SinonStub<Parameters<ManniWatchApiClient['getRouteByVehicleId']>>;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        let createVehicleRouter: (apiClient: ManniWatchApiClient) => express.Router;
        before(async (): Promise<void> => {
            getRouteByVehicleIdStub = sinon.stub();
            apiClientStub = sinon.createStubInstance(ManniWatchApiClient, {
                getRouteByVehicleId: getRouteByVehicleIdStub,
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            createVehicleRouter = (await esmock('./vehicle.js')).createVehicleRouter;
        });

        beforeEach((): void => {
            const route: express.Router = createVehicleRouter(apiClientStub);
            app = express();
            app.use('/vehicle', route);
        });
        afterEach('test and reset promise stub', (): void => {
            getRouteByVehicleIdStub.resetHistory();
        });
        testIds.forEach((testId: string): void => {
            describe(`query '/vehicle/${testId}/route'`, (): void => {
                it('should pass on the provided parameters', async () => {
                    getRouteByVehicleIdStub.resolves(SUCCESS_RESPONSE);
                    await supertest(app)
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
