/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { expect } from 'chai';
import 'mocha';
import { Observable } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { TestScheduler } from 'rxjs/testing';
import * as sinon from 'sinon';
import { CacheEntry } from '../types';
import { vehicleCacheOperator } from './vehicle-cache-operator';

interface IMarbleMap { [key: string]: Partial<CacheEntry>; }
describe('operators/vehicle-cache-operator', (): void => {
    describe('vehicleCacheOperator', (): void => {
        const testError: Error = new Error('This is a test error');
        const sourceValues: IMarbleMap = {
            a: {
                id: '1',
                lastUpdate: 2000,
            },
            b: {
                id: '2',
                lastUpdate: 1000,
            },
            c: {
                id: '3',
                isDeleted: true,
                lastUpdate: 1000,
            },
            d: {
                id: '1',
                lastUpdate: 1000,
            },
            e: {
                id: '2',
                lastUpdate: 2000,
            },
            f: {
                id: '3',
                lastUpdate: 3000,
            },
            g: {
                id: '4',
                isDeleted: true,
                lastUpdate: 3000,
            },
            h: {
                id: '4',
                isDeleted: true,
                lastUpdate: 2000,
            },
            i: {
                id: '4',
                isDeleted: true,
                lastUpdate: 4000,
            },
            j: {
                id: '4',
                lastUpdate: 5000,
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
            const unsub: string = '--------------^-------------!';
            const testValues: IMarbleMap = {
                a: sourceValues.a,
                b: sourceValues.b,
                c: sourceValues.c,
                d: sourceValues.d,
                e: sourceValues.e,
            };
            it('should pass on complete events', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold } = helpers;
                    const foreverStream$: Observable<CacheEntry> =
                        cold<CacheEntry>('-|')
                            .pipe(vehicleCacheOperator());
                    expectObservable(foreverStream$, '--^-----').toBe('---|');
                });
            });
            it('should pass on values and unsubscribe', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold } = helpers;
                    const foreverStream$: Observable<CacheEntry> =
                        cold<CacheEntry>('-a-b-c--d--e---f---|', sourceValues as any)
                            .pipe(vehicleCacheOperator());
                    expectObservable(foreverStream$, unsub).toBe('15ms a-b-c-----e-', sourceValues);
                });
            });
            it('should pass on values and complete', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold } = helpers;
                    const foreverStream$: Observable<CacheEntry> =
                        cold<CacheEntry>('-a-b-c--d--e|', sourceValues as any)
                            .pipe(vehicleCacheOperator());
                    expectObservable(foreverStream$, unsub).toBe('15ms a-b-c-----e|', sourceValues);
                });
            });
            it('should pass on errors', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold } = helpers;
                    const foreverStream$: Observable<CacheEntry> =
                        cold<CacheEntry>('---d--e--#-f---|', sourceValues as any, testError)
                            .pipe(vehicleCacheOperator());
                    expectObservable(foreverStream$, unsub).toBe('17ms d 2ms e 2ms #', testValues, testError);
                });
            });
            it('should not emit previously already deleted locations', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold } = helpers;
                    const foreverStream$: Observable<CacheEntry> =
                        cold<CacheEntry>('--g--h--i|', sourceValues as any)
                            .pipe(vehicleCacheOperator());
                    expectObservable(foreverStream$, unsub)
                        .toBe('16ms a------|', {
                            a: sourceValues.g,
                        });
                });
            });
            it('should emit new if previously deleted', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, cold } = helpers;
                    const foreverStream$: Observable<CacheEntry> =
                        cold<CacheEntry>('--g--j|', sourceValues as any)
                            .pipe(vehicleCacheOperator());
                    expectObservable(foreverStream$, unsub)
                        .toBe('16ms a--b|', {
                            a: sourceValues.g,
                            b: sourceValues.j,
                        });
                });
            });
        });
        describe('test hot observable', (): void => {
            const unsub: string = '-------^-------------!';
            const expectedValues: IMarbleMap = {
                a: sourceValues.e,
                b: sourceValues.f,
            };
            it('should pass on complete events', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, hot } = helpers;
                    const foreverStream$: Observable<CacheEntry> =
                        hot<CacheEntry>('-|')
                            .pipe(vehicleCacheOperator());
                    expectObservable(foreverStream$, '--^-----').toBe('--|');
                });
            });
            it('should pass on values', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, hot } = helpers;
                    const foreverStream$: Observable<CacheEntry> =
                        hot<CacheEntry>('---d--e---f---|', sourceValues as any)
                            .pipe(vehicleCacheOperator());
                    expectObservable(foreverStream$, unsub).toBe('10ms b --- |', expectedValues);
                });
            });
            it('should pass on errors', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, hot } = helpers;
                    const foreverStream$: Observable<CacheEntry> =
                        hot<CacheEntry>('---d----e--#-f---|', sourceValues as any, testError)
                            .pipe(vehicleCacheOperator());
                    expectObservable(foreverStream$, unsub).toBe('8ms a -- #', expectedValues, testError);
                });
            });
            it('should not emit previously already deleted locations', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, hot } = helpers;
                    const foreverStream$: Observable<CacheEntry> =
                        hot<CacheEntry>('--g--h--i|', sourceValues as any)
                            .pipe(vehicleCacheOperator());
                    expectObservable(foreverStream$, unsub)
                        .toBe('8ms a|', {
                            a: sourceValues.i,
                        });
                });
            });
            it('should emit new if previously deleted', (): void => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable, hot } = helpers;
                    const foreverStream$: Observable<CacheEntry> =
                        hot<CacheEntry>('10ms g--j|', sourceValues as any)
                            .pipe(vehicleCacheOperator());
                    expectObservable(foreverStream$, unsub)
                        .toBe('10ms a--b|', {
                            a: sourceValues.g,
                            b: sourceValues.j,
                        });
                });
            });
        });
    });
});
