/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { IVehicleLocationList } from '@manniwatch/api-types';
import { expect } from 'chai';
import 'mocha';
import { of, Observable } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { TestScheduler } from 'rxjs/testing';
import sinon from 'sinon';
import { queryVehiclesOperator } from './query-vehicles';

const testParameter: any[] = [];
[undefined, 1000].forEach((lastUpdate: any): any => {
    ['RAW', 'CORRECT', undefined].forEach((queryType: string): any => {
        testParameter.push({
            lastUpdate,
            type: queryType,
        });
    });
});

const testResponses: any = {
    d: {
        lastUpdate: 1000,
        vehicles: [{
            id: '1',
        }],
    },
    e: {
        lastUpdate: 2000,
        vehicles: [{
            id: '2',
        }],
    },
    f: {
        lastUpdate: 3000,
        vehicles: [{
            id: '3',
        }, {
            id: '4',
        }],
    },
};
const testSources: any = {
    d: testParameter[0],
    e: testParameter[1],
    f: testParameter[2],
};
describe('operators/query-vehicles', (): void => {
    describe('queryVehiclesOperator', (): void => {
        let testScheduler: TestScheduler;
        let sandbox: sinon.SinonSandbox;
        let testApiClient: sinon.SinonStubbedInstance<ManniWatchApiClient>;
        before((): void => {
            sandbox = sinon.createSandbox();
            testApiClient = sandbox.createStubInstance(ManniWatchApiClient);
        });
        beforeEach((): void => {
            testScheduler = new TestScheduler((actual: any, expected: any): void => {
                // asserting the two objects are equal
                // e.g. using chai.
                expect(actual).deep.equal(expected);
            });
            testApiClient
                .getVehicleLocations
                .onCall(0)
                .returns(of(testResponses.d) as any);
            testApiClient
                .getVehicleLocations
                .onCall(1)
                .returns(of(testResponses.e) as any);
            testApiClient
                .getVehicleLocations
                .onCall(2)
                .returns(of(testResponses.f) as any);
            testApiClient
                .getVehicleLocations
                .onCall(3)
                .returns(of(testResponses.d) as any);
            testApiClient
                .getVehicleLocations
                .onCall(4)
                .returns(of(testResponses.e) as any);
            testApiClient
                .getVehicleLocations
                .onCall(5)
                .returns(of(testResponses.f) as any);
        });
        afterEach((): void => {
            sandbox.reset();
        });
        describe('test cold observable', (): void => {
            it('should pass on all parameters correctly', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold, flush } = helpers;
                    const foreverStream$: Observable<IVehicleLocationList> =
                        cold<IVehicleLocationList>('abcdef|', {
                            a: testParameter[0],
                            b: testParameter[1],
                            c: testParameter[2],
                            d: testParameter[3],
                            e: testParameter[4],
                            f: testParameter[5],
                        })
                            .pipe(queryVehiclesOperator(testApiClient as any));
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '--------------^-------------!';
                    const testValues: any = {
                        a: testResponses.d,
                        b: testResponses.e,
                        c: testResponses.f,
                        d: testResponses.d,
                        e: testResponses.e,
                        f: testResponses.f,
                    };
                    expectObservable(foreverStream$, unsub).toBe('14ms abcdef|', testValues);
                    flush();
                });
            });
            it('should convert all non errors', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold, flush } = helpers;
                    const foreverStream$: Observable<IVehicleLocationList> =
                        cold<IVehicleLocationList>('---d--e---f---|', testSources)
                            .pipe(queryVehiclesOperator(testApiClient as any));
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '--------------^-------------!';
                    const testValues: any = {
                        a: testResponses.d,
                        b: testResponses.e,
                        c: testResponses.f,
                    };
                    expectObservable(foreverStream$, unsub).toBe('17ms a 2ms b 3ms c', testValues);
                    flush();
                });
            });
            it('should not stop observable on error', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold, flush } = helpers;
                    const testError: Error = new Error('This is a test error');
                    const foreverStream$: Observable<IVehicleLocationList> =
                        cold<IVehicleLocationList>('---d--e--#-f---|', testSources, testError)
                            .pipe(queryVehiclesOperator(testApiClient as any));
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '--------------^----------------!';
                    const testValues: any = {
                        a: testResponses.d,
                        b: testResponses.e,
                    };
                    expectObservable(foreverStream$, unsub).toBe('17ms a 2ms b 2ms #', testValues, testError);
                    flush();
                });
            });
        });
        describe('test hot observable', (): void => {
            it('should convert all non errors', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, hot } = helpers;
                    const foreverStream$: Observable<IVehicleLocationList> =
                        hot<IVehicleLocationList>('---d--e---f---|', testSources)
                            .pipe(queryVehiclesOperator(testApiClient as any));
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '-------^-------------!';
                    const testValues: any = {
                        a: testResponses.d,
                    };
                    expectObservable(foreverStream$, unsub).toBe('10ms a --- |', testValues);
                });
            });
            it('should not stop observable on error', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, hot } = helpers;
                    const testError: Error = new Error('This is a test error');
                    const foreverStream$: Observable<IVehicleLocationList> =
                        hot<IVehicleLocationList>('---d--e--#-f---|', testSources, testError)
                            .pipe(queryVehiclesOperator(testApiClient as any));
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '-----^-------------!';
                    const testValues: any = {
                        a: testResponses.d,
                    };
                    expectObservable(foreverStream$, unsub).toBe('6ms a 2ms #', testValues, testError);
                });
            });
        });
    });
});
