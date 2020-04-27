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
import { intervalPoll } from './interval-poll';

describe('interval-poll.ts', (): void => {
    let testScheduler: TestScheduler;
    beforeEach((): void => {
        testScheduler = new TestScheduler((actual: any, expected: any): void => {
            // asserting the two objects are equal
            // e.g. using chai.
            expect(actual).deep.equal(expected);
        });
    });
    describe('intervalPoll', (): void => {
        it('should use default repeat delay of 10s', (): void => {
            testScheduler.run((helpers: RunHelpers): void => {
                const { expectObservable } = helpers;
                const kk: sinon.SinonStub = sinon.stub();
                kk.callsFake((lastUpdate: number): Observable<IVehicleLocationList> => {
                    return helpers.cold('100ms a|', {
                        a: {
                            lastUpdate: lastUpdate + 1,
                        } as any,
                    });
                });
                const foreverStream$: Observable<IVehicleLocationList> = intervalPoll(kk);
                // Omitting this arg may crash the test suite.
                const unsub: string = '^ 50s !';
                const testValues: any = {
                    a: { lastUpdate: 1 },
                    b: { lastUpdate: 2 },
                    c: { lastUpdate: 3 },
                    d: { lastUpdate: 4 },
                    e: { lastUpdate: 5 },
                };
                expectObservable(foreverStream$, unsub)
                    .toBe(`100ms a 10100ms b 10100ms c 10100ms d  10100ms e `, testValues);
            });
        });
        it('interval query with network delay', (): void => {
            testScheduler.run((helpers: RunHelpers): void => {
                const { expectObservable } = helpers;
                const kk: sinon.SinonStub = sinon.stub();
                kk.callsFake((lastUpdate: number): Observable<IVehicleLocationList> => {
                    return helpers.cold('1000ms a|', {
                        a: {
                            lastUpdate: lastUpdate + 1,
                        } as any,
                    });
                });
                const foreverStream$: Observable<IVehicleLocationList> = intervalPoll(kk, 20000);
                // Omitting this arg may crash the test suite.
                const unsub: string = '^ 50s !';
                const testValues: any = {
                    a: { lastUpdate: 1 },
                    b: { lastUpdate: 2 },
                    c: { lastUpdate: 3 },
                    d: { lastUpdate: 4 },
                    e: { lastUpdate: 5 },
                };
                expectObservable(foreverStream$, unsub)
                    .toBe('1s a 21000ms b 21000ms c ', testValues);
            });
        });
        it('interval query with network delay', (): void => {
            testScheduler.run((helpers: RunHelpers): void => {
                const { expectObservable } = helpers;
                const kk: sinon.SinonStub = sinon.stub();
                kk.callsFake((lastUpdate: number): Observable<IVehicleLocationList> => {
                    return helpers.cold('1000ms a 200ms b|', {
                        a: {
                            lastUpdate: lastUpdate + 1,
                        } as any,
                        b: {
                            lastUpdate: lastUpdate + 1,
                            second: true,
                        } as any,
                    });
                });
                const foreverStream$: Observable<IVehicleLocationList> = intervalPoll(kk, 20000);
                // Omitting this arg may crash the test suite.
                const unsub: string = '^ 50s !';
                const testValues: any = {
                    a: { lastUpdate: 1 },
                    b: { lastUpdate: 1, second: true },
                    c: { lastUpdate: 2 },
                    d: { lastUpdate: 2, second: true },
                    e: { lastUpdate: 3 },
                    f: { lastUpdate: 3, second: true },
                };
                expectObservable(foreverStream$, unsub)
                    .toBe('1s a 200ms b 21s c 200ms d 21s e 200ms f', testValues);
            });
        });
    });
});
