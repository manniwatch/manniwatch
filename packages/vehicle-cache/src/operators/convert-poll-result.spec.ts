/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { IVehicleLocationList } from '@manniwatch/api-types';
import { expect } from 'chai';
import 'mocha';
import { Observable } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { TestScheduler } from 'rxjs/testing';
import * as sinon from 'sinon';
import { convertPollResult, PollResult } from './convert-poll-result';

describe('operators/convert-poll-result', (): void => {
    describe('convertPollResult', (): void => {
        const sourceValues: any = {
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
        let testScheduler: TestScheduler;
        let sandbox: sinon.SinonSandbox;
        before((): void => {
            sandbox = sinon.createSandbox();
        });
        beforeEach((): void => {
            testScheduler = new TestScheduler((actual: any, expected: any): void => {
                // asserting the two objects are equal
                // e.g. using chai.
                expect(actual).deep.equal(expected);
            });
        });
        afterEach((): void => {
            sandbox.reset();
        });
        describe('test cold observable', (): void => {
            it('should convert all non errors', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold } = helpers;
                    const foreverStream$: Observable<PollResult> =
                        cold<IVehicleLocationList>('---d--e---f---|', sourceValues)
                            .pipe(convertPollResult());
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '--------------^-------------!';
                    const testValues: any = {
                        a: {
                            result: sourceValues.d,
                            type: 'success',
                        },
                        b: {
                            result: sourceValues.e,
                            type: 'success',
                        },
                        c: {
                            result: sourceValues.f,
                            type: 'success',
                        },
                    };
                    expectObservable(foreverStream$, unsub).toBe('17ms a 2ms b 3ms c', testValues);
                });
            });
            it('should not stop observable on error', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold } = helpers;
                    const testError: Error = new Error('This is a test error');
                    const foreverStream$: Observable<PollResult> =
                        cold<IVehicleLocationList>('---d--e--#-f---|', sourceValues, testError)
                            .pipe(convertPollResult());
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '--------------^----------------!';
                    const testValues: any = {
                        a: {
                            result: sourceValues.d,
                            type: 'success',
                        },
                        b: {
                            result: sourceValues.e,
                            type: 'success',
                        },
                        c: {
                            error: testError,
                            type: 'error',
                        },
                    };
                    expectObservable(foreverStream$, unsub).toBe('17ms a 2ms b 2ms (c|)', testValues);
                });
            });
        });
        describe('test hot observable', (): void => {
            it('should convert all non errors', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, hot } = helpers;
                    const foreverStream$: Observable<PollResult> =
                        hot<IVehicleLocationList>('---d--e---f---|', sourceValues)
                            .pipe(convertPollResult());
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '-------^-------------!';
                    const testValues: any = {
                        a: {
                            result: sourceValues.f,
                            type: 'success',
                        },
                    };
                    expectObservable(foreverStream$, unsub).toBe('10ms a --- |', testValues);
                });
            });
            it('should not stop observable on error', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, hot } = helpers;
                    const testError: Error = new Error('This is a test error');
                    const foreverStream$: Observable<PollResult> =
                        hot<IVehicleLocationList>('---d--e--#-f---|', sourceValues, testError)
                            .pipe(convertPollResult());
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '-----^-------------!';
                    const testValues: any = {
                        a: {
                            result: sourceValues.e,
                            type: 'success',
                        },
                        b: {
                            error: testError,
                            type: 'error',
                        },
                    };
                    expectObservable(foreverStream$, unsub).toBe('6ms a 2ms (b|)', testValues);
                });
            });
        });
    });
});
