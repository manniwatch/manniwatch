/*!
 * Source https://github.com/donmahallem/trapeze Package: trapeze-api-proxy-router
 */

import { expect } from 'chai';
import * as express from 'express';
import 'mocha';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import { createTrapezeApiProxyRouter } from './api-routes';
import { StopEndpoints, StopPointEndpoints, TripEndpoints, VehicleEndpoints } from './endpoints';
import { SettingsEndpoints } from './endpoints/settings';

const validTestIds: string[] = [
    'test',
    '1234',
    'otherUrl-',
    '+otherUrl',
];
const invalidTestIds: string[] = [
    ' test',
    '1!234',
    'ot%20herUrl-',
];

interface ITestElement {
    fn: string;
    obj: any;
    path: string;
    noId?: boolean;
}
describe('api-routes.ts', (): void => {
    describe('createTrapezeApiProxyRouter()', (): void => {
        let app: express.Express;
        let routeErrorStub: sinon.SinonStub;
        const NOT_FOUND_RESPONSE: any = { error: true, status: 404 };
        const NOT_FOUND_RESPONSE_LENGTH: string = '' + JSON.stringify(NOT_FOUND_RESPONSE).length;
        const SUCCESS_RESPONSE: any = { error: false, status: 200 };
        const SUCCESS_RESPONSE_LENGTH: string = '' + JSON.stringify(SUCCESS_RESPONSE).length;
        before((): void => {
            routeErrorStub = sinon.stub();
            routeErrorStub.callsFake((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
                res.status(501).json(NOT_FOUND_RESPONSE);
            });
        });
        beforeEach((): void => {
            const route: express.Router = createTrapezeApiProxyRouter('https://localhost:12345/');
            app = express();
            app.use(route);
            app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
                res.status(404);
                res.json(NOT_FOUND_RESPONSE);
            });
            app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
                routeErrorStub(err, req, res, next);
            });
        });
        afterEach((): void => {
            routeErrorStub.resetHistory();
        });
        describe('test testing setup', (): void => {
            let stub: sinon.SinonStub;
            const testError: Error = new Error('test error');
            before((): void => {
                stub = sinon.stub(VehicleEndpoints, 'createVehicleInfoEndpoint');
                stub.callsFake((): express.RequestHandler =>
                    (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                        next(testError);
                    });
            });
            afterEach((): void => {
                stub.resetHistory();
            });
            after((): void => {
                stub.restore();
            });
            it('should use the 404 handler', (done: Mocha.Done): void => {
                supertest(app)
                    .get('/unknown/route')
                    .expect('Content-Type', /json/)
                    .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                    .expect(404)
                    .end((err: any, res: supertest.Response): void => {
                        if (err) {
                            done(err);
                            return;
                        }
                        expect(routeErrorStub.callCount).to.equal(0);
                        expect(res.body).to.deep.equal(NOT_FOUND_RESPONSE);
                        done();
                    });
            });
            it('should use the error handler', (done: Mocha.Done): void => {
                supertest(app)
                    .get('/vehicle/asdf/route')
                    .expect('Content-Type', /json/)
                    .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                    .expect(501)
                    .end((err: any, res: supertest.Response): void => {
                        if (err) {
                            done(err);
                            return;
                        }
                        expect(routeErrorStub.callCount).to.equal(1);
                        expect(res.body).to.deep.equal(NOT_FOUND_RESPONSE);
                        done();
                    });
            });
        });
        const testElements: ITestElement[] = [
            {
                fn: 'createVehicleInfoEndpoint',
                obj: VehicleEndpoints,
                path: '/vehicle/:id/route',
            },
            {
                fn: 'createTripRouteEndpoint',
                obj: TripEndpoints,
                path: '/trip/:id/route',
            },
            {
                fn: 'createStopDeparturesEndpoint',
                obj: StopEndpoints,
                path: '/stop/:id/departures',
            },
            {
                fn: 'createStopInfoEndpoint',
                obj: StopEndpoints,
                path: '/stop/:id/info',
            },
            {
                fn: 'createStopPointInfoEndpoint',
                obj: StopPointEndpoints,
                path: '/stopPoint/:id/info',
            },
            {
                fn: 'createSettingsEndpoint',
                noId: true,
                obj: SettingsEndpoints,
                path: '/settings',
            },
        ];
        testElements.forEach((testElement: ITestElement): void => {
            describe(testElement.path, (): void => {
                let stub: sinon.SinonStub;
                before((): void => {
                    stub = sinon.stub(testElement.obj, testElement.fn);
                    stub.callsFake((): express.RequestHandler =>
                        (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                            res.json(SUCCESS_RESPONSE);
                        });
                });
                afterEach((): void => {
                    stub.resetHistory();
                });
                after((): void => {
                    stub.restore();
                });
                validTestIds.forEach((testId: string): void => {
                    it('should pass for id "' + testId + '"', (done: Mocha.Done): void => {
                        supertest(app)
                            .get(testElement.path.replace(':id', testId))
                            .expect('Content-Type', /json/)
                            .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                            .expect(200)
                            .end((err: any, res: supertest.Response): void => {
                                if (err) {
                                    done(err);
                                    return;
                                }
                                expect(routeErrorStub.callCount).to.equal(0);
                                expect(res.body).to.deep.equal(SUCCESS_RESPONSE);
                                done();
                            });
                    });
                });
                if (!testElement.noId) {
                    invalidTestIds.forEach((testId: string): void => {
                        it('should not pass for id "' + testId + '"', (done: Mocha.Done): void => {
                            supertest(app)
                                .get(testElement.path.replace(':id', testId))
                                .expect('Content-Type', /json/)
                                .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                                .expect(404)
                                .end((err: any, res: supertest.Response): void => {
                                    if (err) {
                                        done(err);
                                        return;
                                    }
                                    expect(routeErrorStub.callCount).to.equal(0);
                                    expect(res.body).to.deep.equal(NOT_FOUND_RESPONSE);
                                    done();
                                });
                        });
                    });
                }
            });
        });
    });
});
