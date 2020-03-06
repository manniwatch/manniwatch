/*!
 * Source https://github.com/donmahallem/trapeze Package: trapeze-api-proxy-router
 */

import { TrapezeApiClient } from '@donmahallem/trapeze-api-client';
import { expect } from 'chai';
import * as express from 'express';
import 'mocha';
import * as sinon from 'sinon';
import * as prom from '../promise-to-response';
import { ITestEndpoint } from './common-test.spec';
import { VehicleEndpoints } from './vehicle';

const testEndpoints: ITestEndpoint<VehicleEndpoints, TrapezeApiClient>[] = [
    {
        endpointFn: 'createVehicleInfoEndpoint',
        innerMethod: 'getRouteByVehicleId',
    },
];
describe('endpoints/vehicle.ts', (): void => {
    describe('VehicleEndpoints', (): void => {
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
                    const endpoint: express.RequestHandler = VehicleEndpoints[testEndpoint.endpointFn](apiClient);
                    endpoint(req, res, next);
                    expect(methodStub.callCount).to.equal(1);
                    expect(methodStub.getCall(0).args).to.deep.equal([
                        req.params.id,
                    ]);
                });
                it('should call inner methods correclty', (): void => {
                    const endpoint: express.RequestHandler = VehicleEndpoints[testEndpoint.endpointFn](apiClient);
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
