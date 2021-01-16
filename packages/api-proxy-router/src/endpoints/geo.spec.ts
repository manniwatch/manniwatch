/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/api-proxy-router
*/

import { IBoundingBox, ManniWatchApiClient } from '@manniwatch/api-client';
import { PositionType } from '@manniwatch/api-types';
import { IValidationSchemas, ServerError } from '@manniwatch/express-utils';
import { expect } from 'chai';
import * as express from 'express';
import { validate, ValidatorResult } from 'jsonschema';
import 'mocha';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import { delayPromise } from './common-test.spec';
import { geoFenceSchema, getVehicleLocationSchema } from './geo';

const validCoordinates: TestIBoundingBox[] = [
    { bottom: '-1000', left: '-1000', right: '1000', top: '1000' },
    { bottom: '-1000', left: '-1000', right: '1000', top: '-500' },
    { bottom: '-1000', left: '-1000', right: '-500', top: '1000' },
    { bottom: '500', left: '-1000', right: '1000', top: '1000' },
    { bottom: '-1000', left: '500', right: '1000', top: '1000' },
];
const validCoordinatesNumbers: { [key in keyof IBoundingBox]: number }[] =
    validCoordinates.map((val: TestIBoundingBox): { [key in keyof IBoundingBox]: number } => ({
        bottom: parseInt(val.bottom, 10),
        left: parseInt(val.left, 10),
        right: parseInt(val.right, 10),
        top: parseInt(val.top, 10),
    }));
const positionTypes: PositionType[] = ['RAW', 'CORRECTED'];
const lastUpdates: string[] = ['22929299292', '2938'];
type TestIBoundingBox = { [key in keyof IBoundingBox]: string };
describe('endpoints/geo.ts', (): void => {
    describe('geoFenceSchema', (): void => {
        const parameters: string[] = ['top', 'bottom', 'right', 'left'];
        const combinations: Partial<TestIBoundingBox>[] = [{}];
        const paramMap: TestIBoundingBox = { bottom: '-1000', left: '-1000', right: '1000', top: '1000' };
        for (let i: number = 0; i < 4; i++) {
            const box1: Partial<TestIBoundingBox> = {};
            box1[parameters[i]] = paramMap[parameters[i]];
            combinations.push(box1);
            for (let j: number = 0; j < 4; j++) {
                if (i === j) {
                    continue;
                }
                const box2: Partial<TestIBoundingBox> = {};
                box2[parameters[i]] = paramMap[parameters[i]];
                box2[parameters[j]] = paramMap[parameters[j]];
                combinations.push(box2);
                for (let k: number = 0; k < 4; k++) {
                    if (i === k || j === k) {
                        continue;
                    }
                    const box3: Partial<TestIBoundingBox> = {};
                    box3[parameters[i]] = paramMap[parameters[i]];
                    box3[parameters[j]] = paramMap[parameters[j]];
                    box3[parameters[k]] = paramMap[parameters[k]];
                    combinations.push(box3);
                }
            }
        }
        describe('reject', (): void => {
            combinations.forEach((combi: Partial<TestIBoundingBox>): void => {
                it('should reject: ' + JSON.stringify(combi), (): void => {
                    const result: ValidatorResult = validate(combi, geoFenceSchema);
                    // tslint:disable-next-line:no-unused-expression
                    expect(result.valid, 'schema should not be valid').to.be.false;
                });
            });
        });
        describe('resolve', (): void => {
            validCoordinates.forEach((combi: TestIBoundingBox): void => {
                it('should resolve: ' + JSON.stringify(combi), (): void => {
                    const result: ValidatorResult = validate(combi, geoFenceSchema);
                    // tslint:disable-next-line:no-unused-expression
                    expect(result.valid, 'schema should not be valid').to.be.true;
                });
            });
        });
    });
    describe('getVehicleLocationSchema', (): void => {
        describe('resolve', (): void => {
            [...positionTypes, undefined].forEach((testPositionType: PositionType): void => {
                [...lastUpdates, undefined].forEach((testLastUpdate: string): void => {
                    const testInstance: any = {
                        lastUpdate: testLastUpdate,
                        positionType: testPositionType,
                    };
                    it('should resolve: ' + JSON.stringify(testInstance), (): void => {
                        const result: ValidatorResult = validate(testInstance, getVehicleLocationSchema);
                        // tslint:disable-next-line:no-unused-expression
                        expect(result.valid, 'schema should be valid').to.be.true;
                    });
                });
            });
        });
        describe('reject', (): void => {
            [...positionTypes, undefined].forEach((testPositionType: PositionType): void => {
                ['-12', 'l337'].forEach((testLastUpdate: string): void => {
                    const testInstance: any = {
                        lastUpdate: testLastUpdate,
                        positionType: testPositionType,
                    };
                    it('should resolve: ' + JSON.stringify(testInstance), (): void => {
                        const result: ValidatorResult = validate(testInstance, getVehicleLocationSchema);
                        // tslint:disable-next-line:no-unused-expression
                        expect(result.valid, 'schema should not be valid').to.be.false;
                    });
                });
            });
            ['tender', '4928'].forEach((testPositionType: PositionType): void => {
                [...lastUpdates, undefined].forEach((testLastUpdate: string): void => {
                    const testInstance: any = {
                        lastUpdate: testLastUpdate,
                        positionType: testPositionType,
                    };
                    it('should resolve: ' + JSON.stringify(testInstance), (): void => {
                        const result: ValidatorResult = validate(testInstance, getVehicleLocationSchema);
                        // tslint:disable-next-line:no-unused-expression
                        expect(result.valid, 'schema should not be valid').to.be.false;
                    });
                });
            });
        });
    });
    describe('createGeoRouter()', (): void => {
        let app: express.Express;
        let routeErrorStub: sinon.SinonStub;
        let sandbox: sinon.SinonSandbox;
        const NOT_FOUND_RESPONSE: any = { error: true, status: 404 };
        const NOT_FOUND_RESPONSE_LENGTH: string = `${JSON.stringify(NOT_FOUND_RESPONSE).length}`;
        const SUCCESS_RESPONSE: any = { error: false, status: 200 };
        const SUCCESS_RESPONSE_LENGTH: string = `${JSON.stringify(SUCCESS_RESPONSE).length}`;
        let stubClient: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        let validateStubParent: sinon.SinonStub;
        let geoFenceValidateStub: sinon.SinonStub;
        let vehicleValidateStub: sinon.SinonStub;
        let createGeoRouter: (client: typeof stubClient) => express.Router;
        before((): void => {
            sandbox = sinon.createSandbox();
            stubClient = sandbox.createStubInstance(ManniWatchApiClient);
            routeErrorStub = sandbox.stub();
            validateStubParent = sandbox.stub();
            geoFenceValidateStub = sandbox.stub();
            vehicleValidateStub = sandbox.stub();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            createGeoRouter = proxyquire('./geo', {
                '@manniwatch/express-utils': {
                    validateRequest: validateStubParent,
                },
            }).createGeoRouter;
        });
        beforeEach((): void => {
            validateStubParent.callsFake((schema: IValidationSchemas): sinon.SinonStub => {
                if (schema.query?.id === 'geoFenceSchema') {
                    return geoFenceValidateStub;
                } else if (schema.query?.id === 'getVehicleLocationSchema') {
                    return vehicleValidateStub;
                } else {
                    throw new Error('Unknown Schema');
                }
            });
            const route: express.Router = createGeoRouter(stubClient);
            app = express();
            app.use(route);
            app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
                res.status(404);
                res.json(NOT_FOUND_RESPONSE);
            });
            app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
                routeErrorStub(err, req, res, next);
            });
            routeErrorStub.callsFake((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
                res.status(501).json(NOT_FOUND_RESPONSE);
            });
        });
        afterEach((): void => {
            expect(validateStubParent.callCount).to.equal(3, 'validate method should be called twice');
            expect(validateStubParent.getCall(0).args).to.deep.equal([{
                query: geoFenceSchema,
            }]);
            expect(validateStubParent.getCall(1).args).to.deep.equal([{
                query: geoFenceSchema,
            }]);
            expect(validateStubParent.getCall(2).args).to.deep.equal([{
                query: getVehicleLocationSchema,
            }]);
            sandbox.reset();
        });
        after((): void => {
            sandbox.restore();
        });
        it('should use the 404 handler', (done: Mocha.Done): void => {
            supertest(app)
                .get('/unknown/route')
                .expect('Content-Type', /json/)
                .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                .expect(404, NOT_FOUND_RESPONSE)
                .end((err: any, res: supertest.Response): void => {
                    if (err) {
                        done(err);
                        return;
                    }
                    expect(routeErrorStub.callCount).to.equal(0);
                })
                .finally(done);
        });
        describe('/stopPoints', (): void => {
            afterEach((): void => {
                expect(vehicleValidateStub.callCount).to.equal(0, 'vehicle schema shouldn\'t be evaluated against this route');
                expect(geoFenceValidateStub.callCount).to.equal(1, 'geo fence validation should only happen once');
            });
            describe('resolves', (): void => {
                beforeEach((): void => {
                    geoFenceValidateStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction): void => {
                        next();
                    });
                });
                validCoordinates.forEach((testCoordinate: TestIBoundingBox, idx: number): void => {
                    const basePath: string = '/stopPoints' +
                        '?bottom=' + testCoordinate.bottom +
                        '&top=' + testCoordinate.top +
                        '&left=' + testCoordinate.left +
                        '&right=' + testCoordinate.right;
                    it('should query the stops with \'' + basePath + '\'', (): Promise<void> => {
                        stubClient.getStopPointLocations.returns(delayPromise(SUCCESS_RESPONSE) as any);
                        return supertest(app)
                            .get(basePath)
                            .expect('Content-Type', /json/)
                            .expect(200, SUCCESS_RESPONSE)
                            .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                            .then((res: supertest.Response): void => {
                                expect(routeErrorStub.callCount).to.equal(0);
                                expect(stubClient.getStopPointLocations.callCount)
                                    .to.equal(1, 'getStopPointLocations should only be called once');
                                expect(stubClient.getStopPointLocations.args).to.deep.equal([[
                                    validCoordinatesNumbers[idx],
                                ]]);
                            });
                    });
                });
            });
            describe('rejects', (): void => {
                beforeEach((): void => {
                    geoFenceValidateStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction): void => {
                        next(new ServerError(1234, 'Caught by schema'));
                    });
                });
                afterEach((): void => {
                    expect(stubClient.getStopPointLocations.callCount).to.equal(0, 'proxy method should never be called');
                });
                validCoordinates.forEach((testCoordinate: TestIBoundingBox): void => {
                    const basePath: string = '/stopPoints' +
                        '?bottom=' + testCoordinate.bottom +
                        '&top=' + testCoordinate.top +
                        '&left=' + testCoordinate.left +
                        '&right=' + testCoordinate.right;
                    it('should reject \'' + basePath + '\'', (): Promise<void> => {
                        stubClient.getStopLocations.returns(delayPromise(SUCCESS_RESPONSE) as any);
                        return supertest(app)
                            .get(basePath)
                            .expect('Content-Type', /json/)
                            .expect(501, NOT_FOUND_RESPONSE)
                            .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                            .then((res: supertest.Response): void => {
                                expect(routeErrorStub.callCount).to.equal(1, 'error handler should be called');
                                const testError: ServerError = routeErrorStub.getCall(0).args[0];
                                expect(testError.message)
                                    .to.equal('Caught by schema');
                                expect(testError.statusCode)
                                    .to.equal(1234);
                            });
                    });
                });
            });
        });
        describe('/stops', (): void => {
            afterEach((): void => {
                expect(vehicleValidateStub.callCount).to.equal(0, 'vehicle schema shouldn\'t be evaluated against this route');
                expect(geoFenceValidateStub.callCount).to.equal(1, 'geo fence validation should only happen once');
            });
            describe('resolves', (): void => {
                beforeEach((): void => {
                    geoFenceValidateStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction): void => {
                        next();
                    });
                });
                validCoordinates.forEach((testCoordinate: TestIBoundingBox, idx: number): void => {
                    const basePath: string = '/stops' +
                        '?bottom=' + testCoordinate.bottom +
                        '&top=' + testCoordinate.top +
                        '&left=' + testCoordinate.left +
                        '&right=' + testCoordinate.right;
                    it('should query the stops with \'' + basePath + '\'', (): Promise<void> => {
                        stubClient.getStopLocations.returns(delayPromise(SUCCESS_RESPONSE) as any);
                        return supertest(app)
                            .get(basePath)
                            .expect('Content-Type', /json/)
                            .expect(200, SUCCESS_RESPONSE)
                            .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                            .then((res: supertest.Response): void => {
                                expect(routeErrorStub.callCount).to.equal(0);
                                expect(stubClient.getStopLocations.callCount)
                                    .to.equal(1, 'getStopLocations should only be called once');
                                expect(stubClient.getStopLocations.args).to.deep.equal([[
                                    validCoordinatesNumbers[idx],
                                ]]);
                            });
                    });
                });
            });
            describe('rejects', (): void => {
                beforeEach((): void => {
                    geoFenceValidateStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction): void => {
                        next(new ServerError(1234, 'Caught by schema'));
                    });
                });
                afterEach((): void => {
                    expect(stubClient.getStopLocations.callCount).to.equal(0, 'proxy method should never be called');
                });
                validCoordinates.forEach((testCoordinate: TestIBoundingBox): void => {
                    const basePath: string = '/stops' +
                        '?bottom=' + testCoordinate.bottom +
                        '&top=' + testCoordinate.top +
                        '&left=' + testCoordinate.left +
                        '&right=' + testCoordinate.right;
                    it('should reject \'' + basePath + '\'', (): Promise<void> => {
                        stubClient.getStopLocations.returns(delayPromise(SUCCESS_RESPONSE) as any);
                        return supertest(app)
                            .get(basePath)
                            .expect('Content-Type', /json/)
                            .expect(501, NOT_FOUND_RESPONSE)
                            .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                            .then((res: supertest.Response): void => {
                                expect(routeErrorStub.callCount).to.equal(1, 'error handler should be called');
                                const testError: ServerError = routeErrorStub.getCall(0).args[0];
                                expect(testError.message)
                                    .to.equal('Caught by schema');
                                expect(testError.statusCode)
                                    .to.equal(1234);
                            });
                    });
                });
            });
        });
        describe('/vehicles', (): void => {
            afterEach((): void => {
                expect(geoFenceValidateStub.callCount).to.equal(0, 'fence schema shouldn\'t be evaluated against this route');
                expect(vehicleValidateStub.callCount).to.equal(1, 'query param validation should only happen once');
            });
            describe('resolves', (): void => {
                beforeEach((): void => {
                    vehicleValidateStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction): void => {
                        next();
                    });
                });
                [...lastUpdates, undefined].forEach((testLastUpdate: string): void => {
                    [...positionTypes, undefined].forEach((testPositionType: PositionType): void => {
                        let basePath: string = '/vehicles';
                        if (testPositionType !== undefined) {
                            basePath += '?positionType=' + testPositionType;
                        }
                        if (testLastUpdate !== undefined) {
                            basePath += ((testPositionType !== undefined) ? '&' : '?') + 'lastUpdate=' + testLastUpdate;
                        }
                        it('should query the vehicles with \'' + basePath + '\'', (): Promise<void> => {
                            stubClient.getVehicleLocations.returns(delayPromise(SUCCESS_RESPONSE) as any);
                            return supertest(app)
                                .get(basePath)
                                .expect('Content-Type', /json/)
                                .expect('Content-Length', SUCCESS_RESPONSE_LENGTH)
                                .expect(200, SUCCESS_RESPONSE)
                                .then((res: supertest.Response): void => {
                                    expect(routeErrorStub.callCount).to.equal(0);
                                    expect(stubClient.getVehicleLocations.callCount)
                                        .to.equal(1, 'getVehicleLocations should only be called once');
                                    const expectedLastUpdate: number | undefined = testLastUpdate ?
                                        parseInt(testLastUpdate, 10) : undefined;
                                    expect(stubClient.getVehicleLocations.args).to.deep.equal([[
                                        testPositionType || 'RAW', expectedLastUpdate,
                                    ]]);
                                });
                        });
                    });
                });
            });
            describe('rejects', (): void => {
                beforeEach((): void => {
                    vehicleValidateStub.callsFake((req: express.Request, res: express.Response, next: express.NextFunction): void => {
                        next(new ServerError(4321, 'Caught by schema'));
                    });
                });
                afterEach((): void => {
                    expect(stubClient.getVehicleLocations.callCount).to.equal(0, 'proxy method should never be called');
                });
                [...lastUpdates, undefined].forEach((testLastUpdate: string): void => {
                    [...positionTypes, undefined].forEach((testPositionType: PositionType): void => {
                        let basePath: string = '/vehicles';
                        if (testPositionType !== undefined) {
                            basePath += '?positionType=' + testPositionType;
                        }
                        if (testLastUpdate !== undefined) {
                            basePath += ((testPositionType !== undefined) ? '&' : '?') + 'lastUpdate=' + testLastUpdate;
                        }
                        it('should query the vehicles with \'' + basePath + '\'', (): Promise<void> => {
                            stubClient.getVehicleLocations.returns(delayPromise(SUCCESS_RESPONSE) as any);
                            return supertest(app)
                                .get(basePath)
                                .expect('Content-Type', /json/)
                                .expect(501, NOT_FOUND_RESPONSE)
                                .expect('Content-Length', NOT_FOUND_RESPONSE_LENGTH)
                                .then((res: supertest.Response): void => {
                                    expect(routeErrorStub.callCount).to.equal(1, 'error handler should be called');
                                    const testError: ServerError = routeErrorStub.getCall(0).args[0];
                                    expect(testError.message)
                                        .to.equal('Caught by schema');
                                    expect(testError.statusCode)
                                        .to.equal(4321);
                                });
                        });
                    });
                });
            });
        });
    });
});
