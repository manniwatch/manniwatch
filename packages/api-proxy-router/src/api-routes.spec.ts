/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { expect } from 'chai';
import * as express from 'express';
import 'mocha';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import { createApiProxyRouter } from './api-routes';
import * as endpoints from './endpoints';
import {
    createTestErrorRequestHandler,
    NOT_FOUND_RESPONSE,
    NOT_FOUND_RESPONSE_LENGTH,
} from './endpoints/common-test.spec';

// tslint:disable:no-unused-expression
interface ITestEndpoint {
    endpointName: string;
    path: string;
}
const testEndpoints: ITestEndpoint[] = [{
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
}];
type EndpointTypes = keyof typeof endpoints;
describe('api-routes.ts', (): void => {
    describe('createApiProxyRouter()', (): void => {
        let sandbox: sinon.SinonSandbox;
        const routerKeys: EndpointTypes[] = Object.keys(endpoints) as EndpointTypes[];
        const endpointStubs: Record<EndpointTypes, sinon.SinonStub> = {} as any;
        before((): void => {
            sandbox = sinon.createSandbox();
            for (const key of routerKeys) {
                endpointStubs[key] = sandbox.stub(endpoints, key);
                endpointStubs[key].callsFake((): express.RequestHandler => {
                    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                        res.json({
                            name: key,
                        });
                    };
                });
            }
        });
        afterEach((): void => {
            sandbox.resetHistory();
        });
        after((): void => {
            sandbox.restore();
        });
        it('should setup with a string as endpoint', (): void => {
            const route: express.Router = createApiProxyRouter(new ManniWatchApiClient('https://localhost:12/'));
            expect(route).to.not.be.undefined;
            for (const key of routerKeys) {
                expect(endpointStubs[key].callCount).to.equal(1, 'should only be called once');
                const arg: ManniWatchApiClient = endpointStubs[key].getCall(0).args[0];
                expect(arg.endpoint).to.equal('https://localhost:12/',
                    `endpoint ${key} should be created with a correct instance`);
            }
        });
        it('should setup with a client instance as endpoint', (): void => {
            const route: express.Router = createApiProxyRouter('https://localhost:12345/');
            expect(route).to.not.be.undefined;
            for (const key of routerKeys) {
                const arg: ManniWatchApiClient = endpointStubs[key].getCall(0).args[0];
                expect(arg.endpoint).to.equal('https://localhost:12345/',
                    `endpoint ${key} should be created with a correct instance`);
            }
        });
        describe('setup inner routes', (): void => {
            let app: express.Express;
            let routeErrorSpy: sinon.SinonSpy;
            before((): void => {
                routeErrorSpy = sinon.spy();
            });
            beforeEach((): void => {
                const route: express.Router = createApiProxyRouter('https://localhost:12345/');
                app = express();
                app.use(route);
                app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
                    res.status(404);
                    res.json(NOT_FOUND_RESPONSE);
                });
                app.use(createTestErrorRequestHandler(routeErrorSpy));
            });
            afterEach((): void => {
                routeErrorSpy.resetHistory();
            });
            describe('test testing setup', (): void => {
                it('should use the 404 handler', (): Promise<void> => {
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
                it('should use the error handler', (): void => {
                    it('needs implementation');
                });
            });
            describe('test endpoints', (): void => {
                testEndpoints.forEach((testEndpoint: ITestEndpoint): void => {
                    it(`should query \'${testEndpoint.path}\' successfully`, (): Promise<void> => {
                        return supertest(app)
                            .get(testEndpoint.path)
                            .expect('Content-Type', /json/)
                            .expect(200, { name: testEndpoint.endpointName })
                            .then((res: supertest.Response): void => {
                                expect(routeErrorSpy.callCount).to.equal(0);
                            });
                    });
                });
            });
        });
    });
});
