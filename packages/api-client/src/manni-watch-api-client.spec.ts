/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import {
    IStopLocations,
    IStopPointInfo,
    IStopPointLocations,
    IVehicleLocationList,
} from '@manniwatch/api-types';
import { expect } from 'chai';
import 'mocha';
import * as nock from 'nock';
import * as reqp from 'request-promise-native';
import * as sinon from 'sinon';
import { IBoundingBox, ManniWatchApiClient, PositionType, StopMode } from './manni-watch-api-client';
import { Util } from './util';

const testSuccessResponse: any = {
    message: 'This is a mocked response',
    status: 200,
};
const STOP_MODES: StopMode[] = ['departure', 'arrival'];
describe('manni-watch-api-client.ts', (): void => {
    describe('ManniWatchApiClient', (): void => {
        const testDomain: string = 'http://test.domain';
        let instance: ManniWatchApiClient;
        before('create Sandbox', (): void => {
            if (!nock.isActive()) {
                nock.activate();
            }
            nock.disableNetConnect();
        });
        beforeEach((): void => {
            instance = new ManniWatchApiClient(testDomain);
            expect(nock.isActive()).to.eq(true);
        });

        afterEach('clear history', (): void => {
            nock.cleanAll();
        });
        after((): void => {
            nock.restore();
            nock.enableNetConnect();
        });
        describe('getProxy()', (): void => {
            let randomStub: sinon.SinonStub;
            before((): void => {
                randomStub = sinon.stub(Math, 'random');
            });
            afterEach((): void => {
                randomStub.reset();
            });
            after((): void => {
                randomStub.restore();
            });
            it('should return undefined if no proxy is defined', (): void => {
                instance.proxies = undefined;
                expect(instance.getProxy()).to.equal(undefined);
                expect(randomStub.callCount).to.equal(0);
            });
            it('should return the defined proxy a string is provided', (): void => {
                instance.proxies = 'testproxy';
                expect(instance.getProxy()).to.equal('testproxy');
                expect(randomStub.callCount).to.equal(0);
            });
            describe('proxy list provided', (): void => {
                [['a', 0.25], ['b', 0.5], ['c', 0.9]].forEach((testValue: [string, number]): void => {
                    it('should return "' + testValue[0] + '" item from the provided proxy list', (): void => {
                        randomStub.returns(testValue[1]);
                        instance.proxies = ['a', 'b', 'c'];
                        expect(instance.getProxy()).to.equal(testValue[0]);
                        expect(randomStub.callCount).to.equal(1);
                    });
                });
            });
        });
        describe('request()', (): void => {
            let getProxyStub: sinon.SinonStub;
            beforeEach((): void => {
                getProxyStub = sinon.stub(instance, 'getProxy');
            });
            afterEach((): void => {
                getProxyStub.restore();
            });
            it('should return undefined if no proxy is defined', (): Promise<void> => {
                const testOpts: reqp.OptionsWithUri = {
                    uri: '/test/path',
                };
                getProxyStub.returns(undefined);
                const scope: nock.Scope = nock(testDomain)
                    .get('/test/path')
                    .matchHeader('User-Agent', /^ManniWatch Api Client\/[0-9+]\.[0-9+]\.[0-9+]/)
                    .reply(200, testSuccessResponse);
                return instance.request(testOpts)
                    .then((val: any): void => {
                        expect(val).to.deep.equal(testSuccessResponse);
                        expect(scope.isDone()).to.eq(true, 'scope should be done');
                    });
            });
        });
        describe('api methods', (): void => {

            let requestStub: sinon.SinonStub;
            const reqpDefault: reqp.RequestPromiseAPI = reqp.defaults({
                baseUrl: testDomain,
                json: true,
            });
            beforeEach((): void => {
                requestStub = sinon.stub(instance, 'request');
                requestStub.callsFake((opts: reqp.OptionsWithUri): reqp.RequestPromise => reqpDefault(opts));
            });
            afterEach((): void => {
                requestStub.restore();
            });
            describe('api methods', (): void => {
                describe('getStopPointInfo', (): void => {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        it('should query stop point info with id "' + testId + '"', (): Promise<void> => {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/services/stopInfo/stopPoint', 'stopPoint=' + testId)
                                .reply(200, testSuccessResponse);
                            return instance.getStopPointInfo(testId)
                                .then((val: IStopPointInfo): void => {
                                    expect(val).to.deep.equal(testSuccessResponse);
                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                });
                        });
                    });
                });
                describe('getStopInfo', (): void => {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        it('should query stop info "' + testId + '" with default parameters', (): Promise<void> => {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/services/stopInfo/stop', 'stop=' + testId)
                                .reply(200, testSuccessResponse);
                            return instance.getStopInfo(testId)
                                .then((val: any): void => {
                                    expect(val).to.deep.equal(testSuccessResponse);
                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                });
                        });
                    });
                });
                describe('getRouteByTripId()', (): void => {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        it('should query route with id: ' + testId, (): Promise<void> => {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/geoserviceDispatcher/services/pathinfo/trip')
                                .query({ id: testId })
                                .reply(200, testSuccessResponse);
                            return instance.getRouteByTripId(testId)
                                .then((val: any): void => {
                                    expect(val).to.deep.equal(testSuccessResponse);
                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                });
                        });
                    });
                });
                describe('getSettings()', (): void => {
                    let transformBodyStub: sinon.SinonStub;
                    before((): void => {
                        transformBodyStub = sinon.stub(Util, 'transformSettingsBody');
                    });
                    afterEach((): void => {
                        transformBodyStub.reset();
                    });
                    after((): void => {
                        transformBodyStub.restore();
                    });
                    it('should get and transform settings as expected', (): Promise<void> => {
                        transformBodyStub.returns(testSuccessResponse);
                        const testResponse: string = 'test = {};';
                        const scope: nock.Scope = nock(testDomain)
                            .get('/internetservice/settings')
                            .reply(200, testResponse);
                        return instance.getSettings()
                            .then((val: any): void => {
                                expect(transformBodyStub.callCount).to.equal(1);
                                expect(transformBodyStub.getCall(0).args[0]).to.deep.eq(testResponse);
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                    });
                });
                describe('getRouteByVehicleId()', (): void => {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        it('should query route with id: ' + testId, (): Promise<void> => {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/geoserviceDispatcher/services/pathinfo/vehicle')
                                .query({ id: testId })
                                .reply(200, testSuccessResponse);
                            return instance.getRouteByVehicleId(testId)
                                .then((val: any): void => {
                                    expect(val).to.deep.equal(testSuccessResponse);
                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                });
                        });
                    });
                });
                describe('getRouteByRouteId()', (): void => {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        ['direction1', 'direction2'].forEach((testDirection: string): void => {
                            it('should query route with id "' + testId + '" and direction "' + testDirection + '"', (): Promise<void> => {
                                const scope: nock.Scope = nock(testDomain)
                                    .post('/internetservice/geoserviceDispatcher/services/pathinfo/route')
                                    .query({ direction: testDirection, id: testId })
                                    .reply(200, testSuccessResponse);
                                return instance.getRouteByRouteId(testId, testDirection)
                                    .then((val: any): void => {
                                        expect(val).to.deep.equal(testSuccessResponse);
                                        expect(scope.isDone()).to.eq(true, 'scope should be done');
                                    });
                            });
                        });
                    });
                });
                describe('getStopLocations()', (): void => {
                    const testBox: IBoundingBox = {
                        bottom: 4,
                        left: 3,
                        right: 2,
                        top: 1,
                    };
                    it('should query route with ' + JSON.stringify(testBox), (): Promise<void> => {
                        const scope: nock.Scope = nock(testDomain)
                            .get('/internetservice/geoserviceDispatcher/services/stopinfo/stops')
                            .query(testBox as any)
                            .reply(200, testSuccessResponse);
                        return instance.getStopLocations(testBox)
                            .then((val: any): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                    });
                    it('should query vehicle locations with default parameters', (): Promise<void> => {
                        const scope: nock.Scope = nock(testDomain)
                            .get('/internetservice/geoserviceDispatcher/services/stopinfo/stops')
                            .query({
                                bottom: -324000000,
                                left: -648000000,
                                right: 648000000,
                                top: 324000000,
                            })
                            .reply(200, testSuccessResponse);
                        return instance.getStopLocations()
                            .then((val: IStopLocations): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                    });
                });
                describe('getStopPointLocations()', (): void => {
                    const testBox: IBoundingBox = {
                        bottom: 4,
                        left: 3,
                        right: 2,
                        top: 1,
                    };
                    it('should query route with ' + JSON.stringify(testBox), (): Promise<void> => {
                        const scope: nock.Scope = nock(testDomain)
                            .get('/internetservice/geoserviceDispatcher/services/stopinfo/stopPoints')
                            .query(testBox as any)
                            .reply(200, testSuccessResponse);
                        return instance.getStopPointLocations(testBox)
                            .then((val: IStopPointLocations): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                    });
                    it('should query vehicle locations with default parameters', (): Promise<void> => {
                        const scope: nock.Scope = nock(testDomain)
                            .get('/internetservice/geoserviceDispatcher/services/stopinfo/stopPoints')
                            .query({
                                bottom: -324000000,
                                left: -648000000,
                                right: 648000000,
                                top: 324000000,
                            })
                            .reply(200, testSuccessResponse);
                        return instance.getStopPointLocations()
                            .then((val: IStopPointLocations): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                    });
                });
                describe('getTripPassages()', (): void => {
                    ['id1', 'id2'].forEach((testId: string): void => {
                        STOP_MODES.forEach((mode: StopMode): void => {
                            it('should query stop point info with mode: ' + mode, (): Promise<void> => {
                                const scope: nock.Scope = nock(testDomain)
                                    .post('/internetservice/services/tripInfo/tripPassages', 'mode=' + mode + '&tripId=' + testId)
                                    .reply(200, testSuccessResponse);
                                return instance.getTripPassages(testId, mode)
                                    .then((val: any): void => {
                                        expect(val).to.deep.equal(testSuccessResponse);
                                        expect(scope.isDone()).to.eq(true, 'scope should be done');
                                    });
                            });
                        });
                        it('should query trip "' + testId + '" info with default parameters', (): Promise<void> => {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/services/tripInfo/tripPassages', 'mode=departure&tripId=' + testId)
                                .reply(200, testSuccessResponse);
                            return instance.getTripPassages(testId)
                                .then((val: any): void => {
                                    expect(val).to.deep.equal(testSuccessResponse);
                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                });
                        });
                    });
                });
                describe('getStopPassages()', (): void => {
                    // tslint:disable-next-line:no-null-keyword
                    const optionalTimes: any[] = [12598, null, undefined];
                    ['id1', 'id2'].forEach((testId: string): void => {
                        STOP_MODES.forEach((mode: StopMode): void => {
                            optionalTimes.forEach((testStartTime: any): void => {
                                optionalTimes.forEach((testTimeFrame: any): void => {
                                    it('should query stop passages for ("' + testId + '","' + mode + '",'
                                        + testStartTime + ',' + testTimeFrame + ')', (): Promise<void> => {
                                            let expectedFormBody: string = 'mode=' + mode + '&stop=' + testId;
                                            // tslint:disable-next-line:triple-equals
                                            if (testStartTime != undefined) {
                                                expectedFormBody += '&startTime=' + testStartTime;
                                            }
                                            // tslint:disable-next-line:triple-equals
                                            if (testTimeFrame != undefined) {
                                                expectedFormBody += '&timeFrame=' + testTimeFrame;
                                            }
                                            const scope: nock.Scope = nock(testDomain)
                                                .post('/internetservice/services/passageInfo/stopPassages/stop',
                                                    expectedFormBody)
                                                .reply(200, testSuccessResponse);
                                            return instance.getStopPassages(testId, mode, testStartTime, testTimeFrame)
                                                .then((val: any): void => {
                                                    expect(val).to.deep.equal(testSuccessResponse);
                                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                                });
                                        });
                                });
                            });
                        });
                        it('should query stop passages for "' + testId + '" with default parameters', (): Promise<void> => {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/services/passageInfo/stopPassages/stop', 'mode=departure&stop=' + testId)
                                .reply(200, testSuccessResponse);
                            return instance.getStopPassages(testId)
                                .then((val: any): void => {
                                    expect(val).to.deep.equal(testSuccessResponse);
                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                });
                        });
                    });
                });
                describe('getStopPointPassages()', (): void => {
                    // tslint:disable-next-line:no-null-keyword
                    const optionalTimes: any[] = [12598, null, undefined];
                    ['id1', 'id2'].forEach((testId: string): void => {
                        STOP_MODES.forEach((mode: StopMode): void => {
                            optionalTimes.forEach((testStartTime: any): void => {
                                optionalTimes.forEach((testTimeFrame: any): void => {
                                    it('should query stop passages for ("' + testId + '","' + mode + '",'
                                        + testStartTime + ',' + testTimeFrame + ')', (): Promise<void> => {
                                            let expectedFormBody: string = 'mode=' + mode + '&stopPoint=' + testId;
                                            // tslint:disable-next-line:triple-equals
                                            if (testStartTime != undefined) {
                                                expectedFormBody += '&startTime=' + testStartTime;
                                            }
                                            // tslint:disable-next-line:triple-equals
                                            if (testTimeFrame != undefined) {
                                                expectedFormBody += '&timeFrame=' + testTimeFrame;
                                            }
                                            const scope: nock.Scope = nock(testDomain)
                                                .post('/internetservice/services/passageInfo/stopPassages/stopPoint',
                                                    expectedFormBody)
                                                .reply(200, testSuccessResponse);
                                            return instance.getStopPointPassages(testId, mode, testStartTime, testTimeFrame)
                                                .then((val: any): void => {
                                                    expect(val).to.deep.equal(testSuccessResponse);
                                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                                });
                                        });
                                });
                            });
                        });
                        it('should query stop passages for "' + testId + '" with default parameters', (): Promise<void> => {
                            const scope: nock.Scope = nock(testDomain)
                                .post('/internetservice/services/passageInfo/stopPassages/stopPoint', 'mode=departure&stopPoint=' + testId)
                                .reply(200, testSuccessResponse);
                            return instance.getStopPointPassages(testId)
                                .then((val: any): void => {
                                    expect(val).to.deep.equal(testSuccessResponse);
                                    expect(scope.isDone()).to.eq(true, 'scope should be done');
                                });
                        });
                    });
                });
                describe('getVehicleLocations()', (): void => {
                    const POS_TYPES: PositionType[] = ['CORRECTED', 'RAW'];

                    POS_TYPES.forEach((mode: PositionType): void => {
                        [10, 100, undefined].forEach((lastUpdate: any): void => {
                            it('should query vehicles with positionType "' + mode + '" and lastUpdate ' + lastUpdate, (): Promise<void> => {
                                // tslint:disable-next-line:triple-equals
                                const expectedQueryParams: any = (lastUpdate == undefined) ? {
                                    colorType: 'ROUTE_BASED',
                                    positionType: mode,
                                } : {
                                        colorType: 'ROUTE_BASED',
                                        lastUpdate,
                                        positionType: mode,
                                    };
                                const scope: nock.Scope = nock(testDomain)
                                    .get('/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles')
                                    .query(expectedQueryParams)
                                    .reply(200, testSuccessResponse);
                                return instance.getVehicleLocations(mode, lastUpdate)
                                    .then((val: IVehicleLocationList): void => {
                                        expect(val).to.deep.equal(testSuccessResponse);
                                        expect(scope.isDone()).to.eq(true, 'scope should be done');
                                    });
                            });
                        });
                    });
                    it('should query vehicle locations with default parameters', (): Promise<void> => {
                        const scope: nock.Scope = nock(testDomain)
                            .get('/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles')
                            .query({
                                colorType: 'ROUTE_BASED',
                                positionType: 'CORRECTED',
                            })
                            .reply(200, testSuccessResponse);
                        return instance.getVehicleLocations()
                            .then((val: IVehicleLocationList): void => {
                                expect(val).to.deep.equal(testSuccessResponse);
                                expect(scope.isDone()).to.eq(true, 'scope should be done');
                            });
                    });
                });
            });
        });
    });
});
