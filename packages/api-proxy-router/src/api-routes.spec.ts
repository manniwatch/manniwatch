/**
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
import { createTestErrorRequestHandler, ErrorSpy, NOT_FOUND_RESPONSE, NOT_FOUND_RESPONSE_LENGTH } from './endpoints/common-test.spec.js';
import * as endpoints from './endpoints/index.js';

interface ITestEndpoint {
    endpointName: string;
    path: string;
}
const testEndpoints: ITestEndpoint[] = [
    {
        endpointName: 'createGeoRouter',
        path: '/geo',
    },
    {
        endpointName: 'createTripRouter',
        path: '/trip',
    },
    {
        endpointName: 'createVehicleRouter',
        path: '/vehicle',
    },
    {
        endpointName: 'createStopRouter',
        path: '/stop',
    },
    {
        endpointName: 'createStopPointRouter',
        path: '/stopPoint',
    },
    {
        endpointName: 'createSettingsRouter',
        path: '/settings',
    },
];
type EndpointTypes = keyof typeof endpoints;
/* eslint-disable mocha/no-setup-in-describe */
describe('api-routes.ts', function (): void {
    describe('createApiProxyRouter()', function (): void {
        let sandbox: sinon.SinonSandbox;
        const routerKeys: EndpointTypes[] = Object.keys(endpoints) as EndpointTypes[];

        const endpointStubs: Record<EndpointTypes, sinon.SinonStub> = {} as Record<EndpointTypes, sinon.SinonStub>;
        let createApiProxyRouter: (apiClient: ManniWatchApiClient | string) => express.Router;

        before(async function (): Promise<void> {
            sandbox = sinon.createSandbox();
            for (const key of routerKeys) {
                endpointStubs[key] = sandbox.stub();
                endpointStubs[key].callsFake((): express.RequestHandler => {
                    return (req: express.Request, res: express.Response): void => {
                        res.json({
                            name: key,
                        });
                    };
                });
            }

            createApiProxyRouter = (
                await esmock('./api-routes.js', {
                    './endpoints/index.js': endpointStubs,
                })
            ).createApiProxyRouter;
        });

        afterEach(function (): void {
            sandbox.resetHistory();
        });

        after(function (): void {
            sandbox.restore();
        });

        it('should setup with a string as endpoint', function (): void {
            const route: express.Router = createApiProxyRouter(new ManniWatchApiClient('https://localhost:12/'));
            expect(route).to.not.be.undefined;
            for (const key of routerKeys) {
                expect(endpointStubs[key].callCount).to.equal(1, 'should only be called once');

                const arg: ManniWatchApiClient = endpointStubs[key].getCall(0).args[0];
                expect(arg.endpoint).to.equal('https://localhost:12/', `endpoint ${key} should be created with a correct instance`);
            }
        });

        it('should setup with a client instance as endpoint', function (): void {
            const route: express.Router = createApiProxyRouter('https://localhost:12345/');
            expect(route).to.not.be.undefined;
            for (const key of routerKeys) {
                const arg: ManniWatchApiClient = endpointStubs[key].getCall(0).args[0];
                expect(arg.endpoint).to.equal('https://localhost:12345/', `endpoint ${key} should be created with a correct instance`);
            }
        });

        describe('setup inner routes', function (): void {
            let app: express.Express;
            let routeErrorSpy: ErrorSpy;

            before(function (): void {
                routeErrorSpy = sinon.spy() as ErrorSpy;
            });

            beforeEach(function (): void {
                const route: express.Router = createApiProxyRouter('https://localhost:12345/');
                app = express();
                app.use(route);
                app.use((req: express.Request, res: express.Response): void => {
                    res.status(404);
                    res.json(NOT_FOUND_RESPONSE);
                });
                app.use(createTestErrorRequestHandler(routeErrorSpy));
            });

            afterEach(function (): void {
                routeErrorSpy.resetHistory();
            });

            describe('test testing setup', function (): void {
                it('should use the 404 handler', function (): Promise<void> {
                    return supertest(app)
                        .get('/unknown/route')
                        .expect('Content-Type', /json/)
                        .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                        .expect(404)
                        .then((res: supertest.Response): void => {
                            expect(routeErrorSpy.callCount).to.equal(0);
                            expect(res.body).to.deep.equal(NOT_FOUND_RESPONSE);
                        });
                });
            });

            describe('test endpoints', function (): void {
                testEndpoints.forEach((testEndpoint: ITestEndpoint): void => {
                    it(`should query '${testEndpoint.path}' successfully`, function (): Promise<void> {
                        return supertest(app)
                            .get(testEndpoint.path)
                            .expect('Content-Type', /json/)
                            .expect(200, { name: testEndpoint.endpointName })
                            .then((): void => {
                                expect(routeErrorSpy.callCount).to.equal(0);
                            });
                    });
                });
            });
        });
    });
});
