/**
 * Package @manniwatch/api-client
 * Source https://manniwatch.github.io/manniwatch/
 */

import type {
    IStopLocations,
    IStopPointInfo,
    IStopPointLocations,
    IVehicleLocationList,
    PositionType,
    StopMode,
} from '@manniwatch/api-types';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { expect } from 'chai';
import 'mocha';
import nock from 'nock';
import sinon from 'sinon';
import { type IBoundingBox, ManniWatchApiClient } from './manni-watch-api-client.js';
import { Util } from './util.js';

interface ITestSuccessResponse {
    message: string;
    status: number;
}
const testSuccessResponse: ITestSuccessResponse = {
    message: 'This is a mocked response',
    status: 200,
};
const testBox: IBoundingBox = {
    bottom: 4,
    left: 3,
    right: 2,
    top: 1,
};
const testBoxParams: Record<keyof IBoundingBox, string> = {
    bottom: '4',
    left: '3',
    right: '2',
    top: '1',
};

/* eslint-disable mocha/no-setup-in-describe */
const STOP_MODES: StopMode[] = ['departure', 'arrival'];
describe('manni-watch-api-client.ts', function (): void {
    describe('ManniWatchApiClient', function (): void {
        const testDomain = 'http://test.domain';
        let instance: ManniWatchApiClient;

        before('create Sandbox', function (): void {
            if (!nock.isActive()) {
                nock.activate();
            }
            nock.disableNetConnect();
        });

        beforeEach(function (): void {
            instance = new ManniWatchApiClient(testDomain);
            expect(nock.isActive()).to.eq(true);
        });

        afterEach('clear history', function (): void {
            nock.cleanAll();
        });

        after(function (): void {
            nock.restore();
            nock.enableNetConnect();
        });

        describe('constructor()', function (): void {
            const testAxios: AxiosInstance = axios.create({ baseURL: 'testinstance' });
            const testInstance: ManniWatchApiClient = new ManniWatchApiClient('test.url', testAxios);
            expect(testInstance.endpoint).to.equal('test.url');
        });

        describe('request()', function (): void {
            it('should return undefined if no proxy is defined', function (): Promise<void> {
                const testOpts: AxiosRequestConfig = {
                    url: '/test/path',
                };
                const scope: nock.Scope = nock(testDomain)
                    .get('/test/path')
                    .matchHeader('User-Agent', /^ManniWatch Api Client\/__BUILD_VERSION__/)
                    .reply(200, testSuccessResponse);
                return instance.request<ITestSuccessResponse, undefined>(testOpts).then((val: ITestSuccessResponse): void => {
                    expect(val).to.deep.equal(testSuccessResponse);
                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                });
            });
        });

        describe('api methods', function (): void {
            let requestStub: sinon.SinonStub;
            const reqpDefault: AxiosInstance = axios.create({
                baseURL: testDomain,
            });

            beforeEach(function (): void {
                requestStub = sinon.stub(instance, 'request');
                requestStub.callsFake((opts: AxiosRequestConfig): Promise<unknown> => {
                    return reqpDefault(opts).then((data: AxiosResponse<unknown>): unknown => data.data);
                });
            });

            afterEach(function (): void {
                requestStub.restore();
            });

            describe('api methods', function (): void {
                describe('getStopPointInfo', function (): void {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        it(`should query stop point info with id "${testId}"`, function (): Promise<void> {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/services/stopInfo/stopPoint', `stopPoint=${testId}`)
                                .reply(200, testSuccessResponse);
                            return instance.getStopPointInfo(testId).then((val: IStopPointInfo): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                        });
                    });
                });

                describe('getStopInfo', function (): void {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        it(`should query stop info "${testId}" with default parameters`, function (): Promise<void> {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/services/stopInfo/stop', `stop=${testId}`)
                                .reply(200, testSuccessResponse);
                            return instance.getStopInfo(testId).then((val: unknown): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                        });
                    });
                });

                describe('getRouteByTripId()', function (): void {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        it(`should query route with id: ${testId}`, function (): Promise<void> {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/geoserviceDispatcher/services/pathinfo/trip')
                                .query({ id: testId })
                                .reply(200, testSuccessResponse);
                            return instance.getRouteByTripId(testId).then((val: unknown): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                        });
                    });
                });

                describe('getSettings()', function (): void {
                    let transformBodyStub: sinon.SinonStub;

                    before(function (): void {
                        transformBodyStub = sinon.stub(Util, 'transformSettingsBody');
                    });

                    afterEach(function (): void {
                        transformBodyStub.reset();
                    });

                    after(function (): void {
                        transformBodyStub.restore();
                    });

                    it('should get and transform settings as expected', function (): Promise<void> {
                        transformBodyStub.returns(testSuccessResponse);
                        const testResponse = 'test = {};';
                        const scope: nock.Scope = nock(testDomain).get('/internetservice/settings').reply(200, testResponse);
                        return instance.getSettings().then((val: unknown): void => {
                            expect(transformBodyStub.callCount).to.equal(1);
                            expect(transformBodyStub.getCall(0).args[0]).to.deep.eq(testResponse);
                            expect(val).to.deep.equal(testSuccessResponse);
                            expect(scope.isDone()).to.eq(true, 'scope should be done');
                        });
                    });
                });

                describe('getRouteByVehicleId()', function (): void {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        it(`should query route with id: ${testId}`, function (): Promise<void> {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/geoserviceDispatcher/services/pathinfo/vehicle')
                                .query({ id: testId })
                                .reply(200, testSuccessResponse);
                            return instance.getRouteByVehicleId(testId).then((val: unknown): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                        });
                    });
                });

                describe('getRouteByRouteId()', function (): void {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        ['direction1', 'direction2'].forEach((testDirection: string): void => {
                            it(`should query route with id "${testId}" and direction "${testDirection}"`, function (): Promise<void> {
                                const scope: nock.Scope = nock(testDomain)
                                    .post('/internetservice/geoserviceDispatcher/services/pathinfo/route')
                                    .query({ direction: testDirection, id: testId })
                                    .reply(200, testSuccessResponse);
                                return instance.getRouteByRouteId(testId, testDirection).then((val: unknown): void => {
                                    expect(val).to.deep.equal(testSuccessResponse);
                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                });
                            });
                        });
                    });
                });

                describe('getStopLocations()', function (): void {
                    it(`should query route with ${JSON.stringify(testBox)}`, function (): Promise<void> {
                        const scope: nock.Scope = nock(testDomain)
                            .get('/internetservice/geoserviceDispatcher/services/stopinfo/stops')
                            .query(testBoxParams)
                            .reply(200, testSuccessResponse);
                        return instance.getStopLocations(testBox).then((val: unknown): void => {
                            expect(val).to.deep.equal(testSuccessResponse);
                            expect(scope.isDone()).to.eq(true, 'scope should be done');
                        });
                    });

                    it('should query vehicle locations with default parameters', function (): Promise<void> {
                        const scope: nock.Scope = nock(testDomain)
                            .get('/internetservice/geoserviceDispatcher/services/stopinfo/stops')
                            .query({
                                bottom: -324000000,
                                left: -648000000,
                                right: 648000000,
                                top: 324000000,
                            })
                            .reply(200, testSuccessResponse);
                        return instance.getStopLocations().then((val: IStopLocations): void => {
                            expect(val).to.deep.equal(testSuccessResponse);
                            expect(scope.isDone()).to.eq(true, 'scope should be done');
                        });
                    });
                });

                describe('getStopPointLocations()', function (): void {
                    it(`should query route with ${JSON.stringify(testBox)}`, function (): Promise<void> {
                        const scope: nock.Scope = nock(testDomain)
                            .get('/internetservice/geoserviceDispatcher/services/stopinfo/stopPoints')
                            .query(testBoxParams)
                            .reply(200, testSuccessResponse);
                        return instance.getStopPointLocations(testBox).then((val: IStopPointLocations): void => {
                            expect(val).to.deep.equal(testSuccessResponse);
                            expect(scope.isDone()).to.eq(true, 'scope should be done');
                        });
                    });

                    it('should query vehicle locations with default parameters', function (): Promise<void> {
                        const scope: nock.Scope = nock(testDomain)
                            .get('/internetservice/geoserviceDispatcher/services/stopinfo/stopPoints')
                            .query({
                                bottom: -324000000,
                                left: -648000000,
                                right: 648000000,
                                top: 324000000,
                            })
                            .reply(200, testSuccessResponse);
                        return instance.getStopPointLocations().then((val: IStopPointLocations): void => {
                            expect(val).to.deep.equal(testSuccessResponse);
                            expect(scope.isDone()).to.eq(true, 'scope should be done');
                        });
                    });
                });

                describe('getTripPassages()', function (): void {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        STOP_MODES.forEach((mode: StopMode): void => {
                            it(`should query stop point info with mode: ${mode}`, function (): Promise<void> {
                                const scope: nock.Scope = nock(testDomain)
                                    .post('/internetservice/services/tripInfo/tripPassages', `mode=${mode}&tripId=${testId}`)
                                    .reply(200, testSuccessResponse);
                                return instance.getTripPassages(testId, mode).then((val: unknown): void => {
                                    expect(val).to.deep.equal(testSuccessResponse);
                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                });
                            });
                        });
                        it(`should query trip "${testId}" info with default parameters`, function (): Promise<void> {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/services/tripInfo/tripPassages', `mode=departure&tripId=${testId}`)
                                .reply(200, testSuccessResponse);
                            return instance.getTripPassages(testId).then((val: unknown): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                        });
                    });
                });

                describe('getStopPassages()', function (): void {
                    // eslint:disable-next-line:@typescript-eslint/no-unsafe-assignment
                    const optionalTimes: (number | null | undefined)[] = [12598, null, undefined];
                    ['id1', 'id2'].forEach((testId: string): void => {
                        STOP_MODES.forEach((mode: StopMode): void => {
                            optionalTimes.forEach((testStartTime: number): void => {
                                optionalTimes.forEach((testTimeFrame: number): void => {
                                    const caseTitle: string =
                                        `should query stop passages for ("${testId}",` + `"${mode}",${testStartTime},${testTimeFrame})`;
                                    it(caseTitle, async function (): Promise<void> {
                                        let expectedFormBody = `mode=${mode}`;
                                        // tslint:disable-next-line:triple-equals
                                        if (testStartTime != undefined) {
                                            expectedFormBody += `&startTime=${testStartTime}`;
                                        }
                                        expectedFormBody += `&stop=${testId}`;
                                        // tslint:disable-next-line:triple-equals
                                        if (testTimeFrame != undefined) {
                                            expectedFormBody += `&timeFrame=${testTimeFrame}`;
                                        }
                                        const scope: nock.Scope = nock(testDomain)
                                            .post('/internetservice/services/passageInfo/stopPassages/stop', expectedFormBody)
                                            .reply(200, testSuccessResponse);
                                        return instance
                                            .getStopPassages(testId, mode, testStartTime, testTimeFrame)
                                            .then((val: unknown): void => {
                                                expect(val).to.deep.equal(testSuccessResponse);
                                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                                            });
                                    });
                                });
                            });
                        });
                        it(`should query stop passages for "${testId}" with default parameters`, function (): Promise<void> {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/services/passageInfo/stopPassages/stop', `mode=departure&stop=${testId}`)
                                .reply(200, testSuccessResponse);
                            return instance.getStopPassages(testId).then((val: unknown): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                        });
                    });
                });

                describe('getStopPointPassages()', function (): void {
                    // eslint:disable-next-line:@typescript-eslint/no-unsafe-assignment
                    const optionalTimes: (number | null | undefined)[] = [12598, null, undefined];
                    ['id1', 'id2'].forEach((testId: string): void => {
                        STOP_MODES.forEach((mode: StopMode): void => {
                            optionalTimes.forEach((testStartTime: number): void => {
                                optionalTimes.forEach((testTimeFrame: number): void => {
                                    const testTitle: string =
                                        `should query stop passages for ("${testId}",` + ` "${mode}", ${testStartTime}, ${testTimeFrame})`;
                                    it(testTitle, async function (): Promise<void> {
                                        let expectedFormBody = `mode=${mode}`;
                                        // tslint:disable-next-line:triple-equals
                                        if (testStartTime != undefined) {
                                            expectedFormBody += `&startTime=${testStartTime}`;
                                        }
                                        expectedFormBody += `&stopPoint=${testId}`;
                                        // tslint:disable-next-line:triple-equals
                                        if (testTimeFrame != undefined) {
                                            expectedFormBody += `&timeFrame=${testTimeFrame}`;
                                        }
                                        const scope: nock.Scope = nock(testDomain)
                                            .post('/internetservice/services/passageInfo/stopPassages/stopPoint', expectedFormBody)
                                            .reply(200, testSuccessResponse);
                                        return instance
                                            .getStopPointPassages(testId, mode, testStartTime, testTimeFrame)
                                            .then((val: unknown): void => {
                                                expect(val).to.deep.equal(testSuccessResponse);
                                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                                            });
                                    });
                                });
                            });
                        });
                        it(`should query stop passages for "${testId}" with default parameters`, function (): Promise<void> {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/services/passageInfo/stopPassages/stopPoint', `mode=departure&stopPoint=${testId}`)
                                .reply(200, testSuccessResponse);
                            return instance.getStopPointPassages(testId).then((val: unknown): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                        });
                    });
                });

                describe('getVehicleLocations()', function (): void {
                    const POS_TYPES: PositionType[] = ['CORRECTED', 'RAW'];

                    POS_TYPES.forEach((mode: PositionType): void => {
                        [10, 100, undefined].forEach((lastUpdate: number): void => {
                            it(`should query vehicles with positionType "${mode}" and lastUpdate ${lastUpdate} `, function (): Promise<void> {
                                // tslint:disable-next-line:triple-equals
                                const expectedQueryParams: {
                                    colorType: 'ROUTE_BASED';
                                    positionType: PositionType;
                                } = {
                                    colorType: 'ROUTE_BASED',
                                    positionType: mode,
                                };
                                const scope: nock.Scope = nock(testDomain)
                                    .get('/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles')
                                    .query({
                                        ...expectedQueryParams,
                                        ...(lastUpdate
                                            ? {
                                                  lastUpdate: `${lastUpdate}`,
                                              }
                                            : undefined),
                                    })
                                    .reply(200, testSuccessResponse);
                                return instance.getVehicleLocations(mode, lastUpdate).then((val: IVehicleLocationList): void => {
                                    expect(val).to.deep.equal(testSuccessResponse);
                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                });
                            });
                        });
                    });

                    it('should query vehicle locations with default parameters', function (): Promise<void> {
                        const scope: nock.Scope = nock(testDomain)
                            .get('/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles')
                            .query({
                                colorType: 'ROUTE_BASED',
                                positionType: 'CORRECTED',
                            })
                            .reply(200, testSuccessResponse);
                        return instance.getVehicleLocations().then((val: IVehicleLocationList): void => {
                            expect(val).to.deep.equal(testSuccessResponse);
                            expect(scope.isDone()).to.eq(true, 'scope should be done');
                        });
                    });
                });
            });
        });
    });
});
