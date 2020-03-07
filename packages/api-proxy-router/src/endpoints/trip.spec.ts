/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { expect } from 'chai';
import * as express from 'express';
import 'mocha';
import * as sinon from 'sinon';
import * as prom from '../promise-to-response';
import { ITestEndpoint } from './common-test.spec';
import { TripEndpoints } from './trip';

const testEndpoints: ITestEndpoint<TripEndpoints, ManniWatchApiClient>[] = [
    {
        endpointFn: 'createTripRouteEndpoint',
        innerMethod: 'getRouteByTripId',
    },
];
describe('endpoints/trip.ts', (): void => {
    describe('TripEndpoints', (): void => {
        const apiClient: ManniWatchApiClient = new ManniWatchApiClient('https://test.url/');
        let promiseStub: sinon.SinonStub;
        before((): void => {
            promiseStub = sinon.stub(prom, 'promiseToResponse');
            promiseStub.resolves(true);
        });

        afterEach('test and reset promise stub', (): void => {
            expect(promiseStub.callCount).to.equal(1);
            promiseStub.resetHistory();
        });

        after((): void => {
            promiseStub.restore();
        });
        testEndpoints.forEach((testEndpoint: any): void => {
            describe(testEndpoint.endpointFn + '(client)', (): void => {
                const methodStubResponse: any = {
                    method: true,
                    response: 'test',
                    stub: 29,
                };
                const req: any = {
                    params: {
                        id: 95482,
                    },
                };
                const res: any = {
                    test: 'many',
                };
                const next: any = {
                    next: true,
                    value: 'test',
                };
                let methodStub: sinon.SinonStub;
                before((): void => {
                    methodStub = sinon.stub(apiClient, testEndpoint.innerMethod);
                    methodStub.returns(methodStubResponse);
                });
                afterEach('test and reset stubs', (): void => {
                    expect(methodStub.callCount).to.equal(1);
                    methodStub.resetHistory();
                });
                after((): void => {
                    methodStub.restore();
                });
                it('should pass on the provided parameters', (): void => {
                    const endpoint: express.RequestHandler = TripEndpoints[testEndpoint.endpointFn](apiClient);
                    endpoint(req, res, next);
                    expect(methodStub.callCount).to.equal(1);
                    expect(methodStub.getCall(0).args).to.deep.equal([
                        req.params.id,
                    ]);
                });
                it('should call inner methods correclty', (): void => {
                    const endpoint: express.RequestHandler = TripEndpoints[testEndpoint.endpointFn](apiClient);
                    endpoint(req, res, next);
                    expect(promiseStub.callCount).to.equal(1);
                    expect(promiseStub.getCall(0).args).to.deep.equal([
                        methodStubResponse,
                        undefined,
                        res,
                        next,
                    ]);
                });
            });
        });
    });
});
