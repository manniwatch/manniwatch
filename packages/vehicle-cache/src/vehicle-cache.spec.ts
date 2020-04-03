/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { VehicleCache } from './vehicle-cache';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { Observable } from 'rxjs';
import { IVehicleLocationList } from '@manniwatch/api-types';

describe('vehicle-cache', (): void => {
    describe('VehicleCache', (): void => {
        let testInstance: VehicleCache;
        let sandbox: sinon.SinonSandbox;
        let testApiClient: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        before((): void => {
            sandbox = sinon.createSandbox();
            testApiClient = sandbox.createStubInstance(ManniWatchApiClient);
        });
        beforeEach((): void => {
            testInstance = new VehicleCache(testApiClient as any);
        });
        afterEach((): void => {
            sandbox.resetHistory();
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
    });
});
