/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { IVehicleLocationList } from '@manniwatch/api-types';
import { IVehicleLocationDiff, VehicleDiffHandler } from '@manniwatch/vehicle-location-diff';
import { expect } from 'chai';
import 'mocha';
import { of, timer, Observable } from 'rxjs';
import { RunHelpers, TestScheduler } from 'rxjs/internal/testing/TestScheduler';
import { map } from 'rxjs/operators';
import * as sinon from 'sinon';
import * as intervalPoll from './interval-poll';
import { VehicleCache } from './vehicle-cache';

describe('vehicle-cache', (): void => {
    describe('VehicleCache', (): void => {
        let testScheduler: TestScheduler;
        let testInstance: VehicleCache;
        let sandbox: sinon.SinonSandbox;
        let testApiClient: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        before((): void => {
            sandbox = sinon.createSandbox();
            testApiClient = sandbox.createStubInstance(ManniWatchApiClient);
        });
        beforeEach((): void => {
            testInstance = new VehicleCache(testApiClient as any);
            testScheduler = new TestScheduler((actual: any, expected: any): void => {
                expect(actual).deep.equal(expected);
            });
        });
        afterEach((): void => {
            sandbox.resetHistory();
        });
        after((): void => {
            sandbox.restore();
        });
        describe('safeQueryData()', (): void => {
            /**
             * Testing doesnt work with marbles
             * https://github.com/ReactiveX/rxjs/pull/745
             */
            let nextSpy: sinon.SinonSpy;
            before((): void => {
                nextSpy = sandbox.spy();
            });
            [0, 12059].forEach((testTimestamp: number): void => {
                it('should resolve with result from promise with timestamp: ' + testTimestamp, (done: Mocha.Done): void => {
                    const testPromise: any = (): Promise<IVehicleLocationList> => {
                        return Promise.resolve('KKKK' as any);
                    };
                    testApiClient.getVehicleLocations.callsFake(testPromise);
                    const foreverStream$: Observable<IVehicleLocationList> = testInstance.safeQueryData(testTimestamp);
                    // Omitting this arg may crash the test suite.
                    foreverStream$
                        .subscribe(nextSpy, done, (): void => {
                            expect(nextSpy.callCount).to.equal(1);
                            expect(nextSpy.getCall(0).args).to.deep.equal(['KKKK']);
                            expect(testApiClient.getVehicleLocations.callCount).to.equal(1);
                            expect(testApiClient.getVehicleLocations.getCall(0).args).to.deep.equal(['RAW', testTimestamp]);
                            done();
                        });
                });
                it('should resolve EMPTY if the promise rejects with timestamp: ' + testTimestamp, (done: Mocha.Done): void => {
                    const testPromise: any = (): Promise<IVehicleLocationList> => {
                        return Promise.reject('KKKK' as any);
                    };
                    testApiClient.getVehicleLocations.callsFake(testPromise);
                    const foreverStream$: Observable<IVehicleLocationList> = testInstance.safeQueryData(testTimestamp);
                    // Omitting this arg may crash the test suite.
                    foreverStream$
                        .subscribe(nextSpy, done, (): void => {
                            expect(nextSpy.callCount).to.equal(0);
                            expect(testApiClient.getVehicleLocations.callCount).to.equal(1);
                            expect(testApiClient.getVehicleLocations.getCall(0).args).to.deep.equal(['RAW', testTimestamp]);
                            done();
                        });
                });
            });
        });
        describe('createSharedPollingObservable()', (): void => {
            let safeQueryDataStub: sinon.SinonStub;
            let vehicleDiffDiffStub: sinon.SinonStub;
            let vehicleDiffConvertStub: sinon.SinonStub;
            let intervalPollStub: sinon.SinonStub;
            before((): void => {
                safeQueryDataStub = sandbox.stub(testInstance, 'safeQueryData');
                vehicleDiffConvertStub = sandbox.stub(VehicleDiffHandler, 'convert');
                vehicleDiffDiffStub = sandbox.stub(VehicleDiffHandler, 'diff');
                intervalPollStub = sandbox.stub(intervalPoll, 'intervalPoll');
            });
            afterEach((): void => {
            });
            it('should resolve with result from promise with timestamp: ', (): void => {
                safeQueryDataStub.callsFake((): Observable<any> => {
                    return of({
                        lastUpdate: safeQueryDataStub.callCount,
                    });
                });
                intervalPollStub.callsFake((): Observable<any> => {
                    return of({
                        lastUpdate: safeQueryDataStub.callCount,
                    });
                });
                vehicleDiffDiffStub.returns(1);
                vehicleDiffConvertStub.returns(1);
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable } = helpers;
                    const foreverStream$: Observable<IVehicleLocationDiff> = testInstance.createSharedPollingObservable();
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '^ 50s !';
                    const testValues: any = {
                        a: { lastUpdate: 0 },
                    };
                    expectObservable(foreverStream$, unsub)
                        .toBe(`(a|)`, testValues);
                });
            });
            it('should resolve repeating events ', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    safeQueryDataStub.callsFake((): any => {
                        return true;
                    });
                    intervalPollStub.callsFake((): Observable<any> => {
                        return timer(0, 1000).pipe(map((): any => {
                            return {
                                lastUpdate: safeQueryDataStub.callCount,
                            };
                        }));
                    });
                    vehicleDiffDiffStub.callsFake((): any => {
                        return {
                            lastUpdate: vehicleDiffDiffStub.callCount,
                        };
                    });
                    vehicleDiffConvertStub.returns(1);
                    const { expectObservable } = helpers;
                    const foreverStream$: Observable<IVehicleLocationDiff> = testInstance.createSharedPollingObservable();
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '^ 3s !';
                    const testValues: any = {
                        a: { lastUpdate: 0 },
                        b: { lastUpdate: 1 },
                        c: { lastUpdate: 2 },
                        d: { lastUpdate: 3 },
                    };
                    expectObservable(foreverStream$, unsub)
                        .toBe(`a 999ms b 999ms c 999ms d`, testValues);
                });
            });
            it('should resolve repeating events ', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    safeQueryDataStub.callsFake((): any => {
                        return true;
                    });
                    intervalPollStub.callsFake((): Observable<any> => {
                        let counter: number = 0;
                        return timer(0, 1000).pipe(map((): any => {
                            const resp: any = {
                                lastUpdate: counter,
                            };
                            counter += 1;
                            return resp;
                        }));
                    });
                    vehicleDiffDiffStub.returnsArg(1);
                    vehicleDiffConvertStub.returnsArg(0);
                    const { expectObservable } = helpers;
                    const foreverStream$: Observable<IVehicleLocationDiff> = testInstance.createSharedPollingObservable();
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '^ 3s !';
                    const unsub2: string = '2s ^ 2500ms !';
                    const unsub3: string = '100s ^ 2500ms !';
                    const testValues: any = {
                        a: { lastUpdate: 0 },
                        b: { lastUpdate: 1 },
                        c: { lastUpdate: 2 },
                        d: { lastUpdate: 3 },
                        e: { lastUpdate: 4 },
                        f: { lastUpdate: 5 },
                        g: { lastUpdate: 6 },
                        h: { lastUpdate: 7 },
                    };
                    expectObservable(foreverStream$, unsub)
                        .toBe(`a 999ms b 999ms c 999ms d`, testValues);
                    expectObservable(foreverStream$, unsub2)
                        .toBe(`2s (bc) 996ms d 999ms e`, testValues);
                    expectObservable(foreverStream$, unsub3)
                        .toBe(`100s f 999ms g 999ms h`, testValues);
                });
            });
        });
    });
});
