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
import { createStopPointRouter } from './stop-point';
const testIds: string[] = ['-12883', 'kasd'];
describe('endpoints/trip.ts', (): void => {
    describe('createTripRouter', (): void => {
        let app: express.Express;
        let promiseStub: sinon.SinonStub;
        let getStopPointInfoStub: sinon.SinonStub;
        let apiClientStub: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        before((): void => {
            promiseStub = sinon.stub(prom, 'promiseToResponse');
            getStopPointInfoStub = sinon.stub();
            apiClientStub = sinon.createStubInstance(ManniWatchApiClient, {
                getStopPointInfo: getStopPointInfoStub as any,
            });
        });

        beforeEach((): void => {
            const route: express.Router = createStopPointRouter(apiClientStub as any);
            app = express();
            app.use('/stopPoint', route);
        });
        afterEach('test and reset promise stub', (): void => {
            expect(promiseStub.callCount).to.equal(1);
            promiseStub.resetHistory();
            getStopPointInfoStub.resetHistory();
        });
        after((): void => {
            promiseStub.restore();
        });
        testIds.forEach((testId: string): void => {
            const queryUrl: string = `/stopPoint/${testId}/info`;
            it(`should query \'${queryUrl}\'`, (): Promise<void> => {
                getStopPointInfoStub.resolves(SUCCESS_RESPONSE);
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
                        expect(apiClientStub.getStopPointInfo.callCount)
                            .to.equal(1, 'getStopPointInfo should only be called once');
                        expect(apiClientStub.getStopPointInfo.getCall(0).args)
                            .to.deep.equal([testId]);
                    });
            });
        });
    });
});
