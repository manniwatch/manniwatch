/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/vehicle-cache
*/

import { IVehicleLocationList, PositionType } from '@manniwatch/api-types';
import { expect } from 'chai';
import 'mocha';
import { of, Observable } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { delay } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import * as sinon from 'sinon';
import { intervalVehicleLocationPoll } from './interval-vehicle-location-poll';

describe('interval-vehicle-location-poll', (): void => {
    describe('intervalVehicleLocationPoll()', (): void => {
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
        it('should constantly poll', (): void => {
            testScheduler.run((helpers: RunHelpers): void => {
                const { expectObservable } = helpers;
                const foreverStream$: Observable<IVehicleLocationList> =
                    intervalVehicleLocationPoll((mode: PositionType, lastUpdate: number): Observable<IVehicleLocationList> => of({
                        lastUpdate: lastUpdate + 1000,
                        vehicles: [],
                    }).pipe(delay(1000)), 10000);
                // Omitting this arg may crash the test suite.
                const unsub: string = '^ 50s !';
                const unsub2: string = '25s ^ 9s !';
                const unsub3: string = '70s ^ 20s !';
                const testValues: any = {
                    a: {
                        lastUpdate: 1000,
                        vehicles: [],
                    },
                    b: {
                        lastUpdate: 2000,
                        vehicles: [],
                    },
                    c: {
                        lastUpdate: 3000,
                        vehicles: [],
                    },
                    d: {
                        lastUpdate: 4000,
                        vehicles: [],
                    },
                    e: {
                        lastUpdate: 5000,
                        vehicles: [],
                    },
                };
                expectObservable(foreverStream$, unsub).toBe('1s a 10999ms b 10999ms c 10999ms d 10999ms e', testValues);
                expectObservable(foreverStream$, unsub2).toBe('26s a', testValues);
                expectObservable(foreverStream$, unsub3).toBe('71s a 10999ms b', testValues);
            });
        });
    });
});
