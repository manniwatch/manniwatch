/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { IVehicleLocationList } from '@manniwatch/api-types';
import { expect } from 'chai';
import 'mocha';
import { Observable } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { TestScheduler } from 'rxjs/testing';
import sinon from 'sinon';
import { queryVehicles } from './query-vehicles';

describe('observable/query-vehicles', (): void => {
    describe('queryVehicles', (): void => {
        let testScheduler: TestScheduler;
        let sandbox: sinon.SinonSandbox;
        let stubInstance: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        before((): void => {
            sandbox = sinon.createSandbox();
        });
        beforeEach((): void => {
            stubInstance = sandbox.createStubInstance(ManniWatchApiClient);
            testScheduler = new TestScheduler((actual: any, expected: any): void => {
                // asserting the two objects are equal
                // e.g. using chai.
                expect(actual).deep.equal(expected);
            });
        });
        afterEach((): void => {
            sandbox.reset();
        });
        [0, undefined, 2000].forEach((testLastUpdate: any): void => {
            [undefined, 'RAW', 'CORRECTED'].forEach((posType: any): void => {
                it(`should query for vehicles with (${posType},${testLastUpdate})`, (): void => {
                    const testResponse: any = { lastUpdate: 123, vehicles: [] };
                    testScheduler.run((helpers: RunHelpers): void => {
                        const { expectObservable, flush, cold } = helpers;
                        const coldTest: Observable<IVehicleLocationList> = cold<IVehicleLocationList>('---a|', { a: testResponse });
                        // Omitting this arg may crash the test suite.
                        stubInstance
                            .getVehicleLocations
                            .returns(coldTest as any);
                        const unsub: string = '14ms ^ 250ms !';
                        const testObservable: Observable<IVehicleLocationList> =
                            queryVehicles(stubInstance as any, posType, testLastUpdate);
                        expectObservable(testObservable, unsub).toBe('17ms a|', {
                            a: testResponse,
                        });
                        flush();
                        expect(stubInstance.getVehicleLocations.callCount).to.equal(1);
                        expect(stubInstance.getVehicleLocations.args)
                            .to.deep.equal([[posType || 'RAW', testLastUpdate || 0]]);
                    });
                });
            });
        });
        it(`should pass on errors`, (): void => {
            const testError: Error = new Error('This is a test error');
            testScheduler.run((helpers: RunHelpers): void => {
                const { expectObservable, flush, cold } = helpers;
                const coldTest: Observable<IVehicleLocationList> = cold<IVehicleLocationList>('---#|', undefined, testError);
                // Omitting this arg may crash the test suite.
                stubInstance
                    .getVehicleLocations
                    .returns(coldTest as any);
                const unsub: string = '14ms ^ 250ms !';
                const testObservable: Observable<IVehicleLocationList> =
                    queryVehicles(stubInstance as any);
                expectObservable(testObservable, unsub).toBe('17ms #', undefined, testError);
                flush();
                expect(stubInstance.getVehicleLocations.callCount).to.equal(1);
                expect(stubInstance.getVehicleLocations.args)
                    .to.deep.equal([['RAW', 0]]);
            });
        });
    });
});
