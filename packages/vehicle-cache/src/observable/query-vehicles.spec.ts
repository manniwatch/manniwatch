/**
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { type IVehicleLocationList } from '@manniwatch/api-types';
import { expect } from 'chai';
import 'mocha';
import { Observable } from 'rxjs';
import type { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { TestScheduler } from 'rxjs/testing';
import sinon from 'sinon';
import { queryVehicles } from './query-vehicles.js';

/* eslint-disable @typescript-eslint/no-explicit-any, mocha/no-setup-in-describe */
describe('observable/query-vehicles', function (): void {
    describe('queryVehicles', function (): void {
        let testScheduler: TestScheduler;
        let sandbox: sinon.SinonSandbox;
        let stubInstance: sinon.SinonStubbedInstance<ManniWatchApiClient>;

        before(function (): void {
            sandbox = sinon.createSandbox();
        });

        beforeEach(function (): void {
            stubInstance = sandbox.createStubInstance(ManniWatchApiClient);
            testScheduler = new TestScheduler((actual: any, expected: any): void => {
                // asserting the two objects are equal
                // e.g. using chai.
                expect(actual).deep.equal(expected);
            });
        });

        afterEach(function (): void {
            sandbox.reset();
        });
        [0, undefined, 2000].forEach((testLastUpdate: any): void => {
            [undefined, 'RAW', 'CORRECTED'].forEach((posType: any): void => {
                it(`should query for vehicles with (${posType},${testLastUpdate})`, function (): void {
                    const testResponse: any = { lastUpdate: 123, vehicles: [] };
                    testScheduler.run((helpers: RunHelpers): void => {
                        const { expectObservable, flush, cold } = helpers;
                        const coldTest: Observable<IVehicleLocationList> = cold<IVehicleLocationList>('---a|', { a: testResponse });
                        // Omitting this arg may crash the test suite.
                        stubInstance.getVehicleLocations.returns(coldTest as any);
                        const unsub: string = '14ms ^ 250ms !';
                        const testObservable: Observable<IVehicleLocationList> = queryVehicles(
                            stubInstance as any,
                            posType,
                            testLastUpdate
                        );
                        expectObservable(testObservable, unsub).toBe('17ms a|', {
                            a: testResponse,
                        });
                        flush();
                        expect(stubInstance.getVehicleLocations.callCount).to.equal(1);
                        expect(stubInstance.getVehicleLocations.args).to.deep.equal([[posType || 'RAW', testLastUpdate || 0]]);
                    });
                });
            });
        });

        it(`should pass on errors`, function (): void {
            const testError: Error = new Error('This is a test error');
            testScheduler.run((helpers: RunHelpers): void => {
                const { expectObservable, flush, cold } = helpers;
                const coldTest: Observable<IVehicleLocationList> = cold<IVehicleLocationList>('---#|', undefined, testError);
                // Omitting this arg may crash the test suite.
                stubInstance.getVehicleLocations.returns(coldTest as any);
                const unsub: string = '14ms ^ 250ms !';
                const testObservable: Observable<IVehicleLocationList> = queryVehicles(stubInstance as any);
                expectObservable(testObservable, unsub).toBe('17ms #', undefined, testError);
                flush();
                expect(stubInstance.getVehicleLocations.callCount).to.equal(1);
                expect(stubInstance.getVehicleLocations.args).to.deep.equal([['RAW', 0]]);
            });
        });
    });
});
