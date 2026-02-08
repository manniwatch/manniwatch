/**
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { type IVehicleLocationList } from '@manniwatch/api-types';
import { expect } from 'chai';
import 'mocha';
import { Observable } from 'rxjs';
import type { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { TestScheduler } from 'rxjs/testing';
import * as sinon from 'sinon';
import { convertToCacheEntries } from './convert-to-cache-entries.js';
import { type CacheEntry } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('operators/convert-to-cache-entries', function (): void {
    describe('convertToCacheEntries', function (): void {
        const testError: Error = new Error('This is a test error');
        const sourceValues: any = {
            d: {
                lastUpdate: 1000,
                vehicles: [
                    {
                        id: '1',
                    },
                ],
            },
            e: {
                lastUpdate: 2000,
                vehicles: [
                    {
                        id: '2',
                    },
                ],
            },
            f: {
                lastUpdate: 3000,
                vehicles: [
                    {
                        id: '3',
                    },
                    {
                        id: '4',
                    },
                ],
            },
        };
        let testScheduler: TestScheduler;
        let sandbox: sinon.SinonSandbox;

        before(function (): void {
            sandbox = sinon.createSandbox();
        });

        beforeEach(function (): void {
            testScheduler = new TestScheduler((actual: any, expected: any): void => {
                // asserting the two objects are equal
                // e.g. using chai.
                expect(actual).deep.equal(expected);
            });
        });

        afterEach(function (): void {
            sandbox.reset();
        });

        describe('test cold observable', function (): void {
            const unsub: string = '--------------^----------------!';
            const expectedValues: any = {
                a: [
                    {
                        id: '1',
                        lastUpdate: 1000,
                    },
                ],
                b: [
                    {
                        id: '2',
                        lastUpdate: 2000,
                    },
                ],
                c: [
                    {
                        id: '3',
                        lastUpdate: 3000,
                    },
                    {
                        id: '4',
                        lastUpdate: 3000,
                    },
                ],
            };

            it('should pass on values', function (): void {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold } = helpers;
                    const foreverStream$: Observable<CacheEntry[]> = cold<IVehicleLocationList>('---d--e---f---|', sourceValues).pipe(
                        convertToCacheEntries()
                    );
                    // Omitting this arg may crash the test suite.
                    expectObservable(foreverStream$, unsub).toBe('17ms a 2ms b 3ms c---|', expectedValues);
                });
            });

            it('should pass on errors', function (): void {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold } = helpers;
                    const foreverStream$: Observable<CacheEntry[]> = cold<IVehicleLocationList>(
                        '---d--e--#-f---|',
                        sourceValues,
                        testError
                    ).pipe(convertToCacheEntries());
                    // Omitting this arg may crash the test suite.
                    expectObservable(foreverStream$, unsub).toBe('17ms a 2ms b 2ms #', expectedValues, testError);
                });
            });
        });

        describe('test hot observable', function (): void {
            const expectedValues: any = {
                a: [
                    {
                        id: '2',
                        lastUpdate: 2000,
                    },
                ],
                b: [
                    {
                        id: '3',
                        lastUpdate: 3000,
                    },
                    {
                        id: '4',
                        lastUpdate: 3000,
                    },
                ],
            };
            const unsub: string = '-----^-----------------!';

            it('should convert all values', function (): void {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, hot } = helpers;
                    const foreverStream$: Observable<CacheEntry[]> = hot<IVehicleLocationList>('---d--e---f---|', sourceValues).pipe(
                        convertToCacheEntries()
                    );
                    // Omitting this arg may crash the test suite.
                    expectObservable(foreverStream$, unsub).toBe('6ms a---b---|', expectedValues);
                });
            });

            it('should pass on errors', function (): void {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, hot } = helpers;
                    const foreverStream$: Observable<CacheEntry[]> = hot<IVehicleLocationList>(
                        '---d--e--#-f---|',
                        sourceValues,
                        testError
                    ).pipe(convertToCacheEntries());
                    // Omitting this arg may crash the test suite.
                    expectObservable(foreverStream$, unsub).toBe('6ms a -- #', expectedValues, testError);
                });
            });
        });
    });
});
