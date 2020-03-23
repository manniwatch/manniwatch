/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import * as prom from '@manniwatch/express-utils';
import { expect } from 'chai';
import * as express from 'express';
import 'mocha';
import * as sinon from 'sinon';
import { ITestEndpoint } from './common-test.spec';
import { StopPointEndpoints } from './stop-point';

const testEndpoints: ITestEndpoint<StopPointEndpoints, ManniWatchApiClient>[] = [
    {
        endpointFn: 'createStopPointInfoEndpoint',
        innerMethod: 'getStopPointInfo',
    },
];
describe('endpoints/stop-point.ts', (): void => {
    describe('StopPointEndpoints', (): void => {
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
                    const endpoint: express.RequestHandler = StopPointEndpoints[testEndpoint.endpointFn](apiClient);
                    endpoint(req, res, next);
                    expect(methodStub.callCount).to.equal(1);
                    expect(methodStub.getCall(0).args).to.deep.equal([
                        req.params.id,
                    ]);
                });
                it('should call inner methods correclty', (): void => {
                    const endpoint: express.RequestHandler = StopPointEndpoints[testEndpoint.endpointFn](apiClient);
                    endpoint(req, res, next);
                    expect(promiseStub.callCount).to.equal(1);
                    expect(promiseStub.getCall(0).args).to.deep.equal([
                        methodStubResponse,
                        res,
                        next,
                    ]);
                });
            });
        });
    });
});
