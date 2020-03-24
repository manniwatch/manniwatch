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
import { SUCCESS_RESPONSE, SUCCESS_RESPONSE_LENGTH } from './common-test.spec';
import { createVehicleRouter } from './vehicle';
const testIds: string[] = ['-12883', 'kasd'];
describe('endpoints/vehicle.ts', (): void => {
    describe('createVehicleRouter', (): void => {
        let app: express.Express;
        let promiseStub: sinon.SinonStub;
        let getRouteByVehicleIdStub: sinon.SinonStub;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        before((): void => {
            promiseStub = sinon.stub(prom, 'promiseToResponse');
            getRouteByVehicleIdStub = sinon.stub();
            apiClientStub = sinon.createStubInstance(ManniWatchApiClient, {
                getRouteByVehicleId: getRouteByVehicleIdStub as any,
            });
        });

        beforeEach((): void => {
            const route: express.Router = createVehicleRouter(apiClientStub as any);
            app = express();
            app.use('/vehicle', route);
        });
        afterEach('test and reset promise stub', (): void => {
            expect(promiseStub.callCount).to.equal(1);
            promiseStub.resetHistory();
            getRouteByVehicleIdStub.resetHistory();
        });
        after((): void => {
            promiseStub.restore();
        });
        testIds.forEach((testId: string): void => {
            describe('query \'/vehicle/' + testId + '/route\'', (): void => {
                it('should pass on the provided parameters', (): Promise<void> => {
                    getRouteByVehicleIdStub.resolves(SUCCESS_RESPONSE);
                    promiseStub.callsFake((source: Promise<any>, res: express.Response, next: express.NextFunction): void => {
                        source
                            .then((responseObject: any): void => {
                                res.json(responseObject);
                            });
                    });
                    return supertest(app)
                        .get(`/vehicle/${testId}/route`)
                        .expect('Content-Type', /json/)
                        .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                        .expect(200, SUCCESS_RESPONSE)
                        .then((res: supertest.Response): void => {
                            expect(apiClientStub.getRouteByVehicleId.callCount)
                                .to.equal(1, 'getSettings should only be called once');
                            expect(apiClientStub.getRouteByVehicleId.getCall(0).args)
                                .to.deep.equal([testId]);
                        });
                });
            });
        });
    });
});
