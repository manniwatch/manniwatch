/*!
 * Source https://github.com/manniwatch/trapeze Package: trapeze-api-proxy-router
 */

import { TrapezeApiClient } from '@manniwatch/api-client';
import { expect } from 'chai';
import * as express from 'express';
import 'mocha';
import * as sinon from 'sinon';
import * as prom from '../promise-to-response';
import { ITestEndpoint } from './common-test.spec';
import { StopEndpoints } from './stop';

const testEndpoints: ITestEndpoint<StopEndpoints, TrapezeApiClient>[] = [
    {
        endpointFn: 'createStopInfoEndpoint',
        innerMethod: 'getStopInfo',
    },
    {
        endpointFn: 'createStopDeparturesEndpoint',
        innerMethod: 'getStopPassages',
    },
];
describe('endpoints/stop.ts', (): void => {
    describe('StopEndpoints', (): void => {
        const apiClient: TrapezeApiClient = new TrapezeApiClient('https://test.url/');
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
                    const endpoint: express.RequestHandler = StopEndpoints[testEndpoint.endpointFn](apiClient);
                    endpoint(req, res, next);
                    expect(methodStub.callCount).to.equal(1);
                    expect(methodStub.getCall(0).args).to.deep.equal([
                        req.params.id,
                    ]);
                });
                it('should call inner methods correclty', (): void => {
                    const endpoint: express.RequestHandler = StopEndpoints[testEndpoint.endpointFn](apiClient);
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
