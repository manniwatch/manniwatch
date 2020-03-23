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
import { createTripRouter } from './trip';
const testIds: string[] = ['-12883', 'kasd'];
describe('endpoints/trip.ts', (): void => {
    describe('createTripRouter', (): void => {
        let app: express.Express;
        let promiseStub: sinon.SinonStub;
        let getRouteByTripIdStub: sinon.SinonStub;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        before((): void => {
            promiseStub = sinon.stub(prom, 'promiseToResponse');
            getRouteByTripIdStub = sinon.stub();
            apiClientStub = sinon.createStubInstance(ManniWatchApiClient, {
                getRouteByTripId: getRouteByTripIdStub as any,
            });
        });

        beforeEach((): void => {
            const route: express.Router = createTripRouter(apiClientStub as any);
            app = express();
            app.use('/trip', route);
        });
        afterEach('test and reset promise stub', (): void => {
            expect(promiseStub.callCount).to.equal(1);
            promiseStub.resetHistory();
            getRouteByTripIdStub.resetHistory();
        });
        after((): void => {
            promiseStub.restore();
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
    });
});
