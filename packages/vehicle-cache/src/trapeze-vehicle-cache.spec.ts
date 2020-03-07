/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { IVehicleLocationList } from '@manniwatch/api-types';
import { expect } from 'chai';
import 'mocha';
import { of, Observable } from 'rxjs';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { TestScheduler } from 'rxjs/testing';
import * as sinon from 'sinon';
import { TrapezeVehicleCache } from './trapeze-vehicle-cache';

describe('trapeze-vehicle-cache', (): void => {
    describe('TrapezeVehicleCache', (): void => {
        let testScheduler: TestScheduler;
        let testInstance: TrapezeVehicleCache;
        let sandbox: sinon.SinonSandbox;
        before((): void => {
            sandbox = sinon.createSandbox();
        });
        beforeEach((): void => {
            testInstance = new TrapezeVehicleCache(undefined as any);
            testScheduler = new TestScheduler((actual: any, expected: any): void => {
                // asserting the two objects are equal
                // e.g. using chai.
                expect(actual).deep.equal(expected);
            });
        });
        afterEach((): void => {
            sandbox.resetHistory();
        });
        describe('createPollingObservable()', (): void => {
            let safeQueryDataStub: sinon.SinonStub;
            beforeEach((): void => {
                safeQueryDataStub = sandbox.stub(testInstance, 'safeQueryData');
            });
            afterEach((): void => {
                safeQueryDataStub.restore();
            });
            it('generate the stream correctly4', (): void => {
                safeQueryDataStub.returns(of({}));
                testScheduler.run((helpers: RunHelpers): void => {
                    const { expectObservable } = helpers;
                    const foreverStream$: Observable<IVehicleLocationList> = testInstance.createPollingObservable();
                    // Omitting this arg may crash the test suite.
                    const unsub: string = '^ 50s !';
                    const unsub2: string = '25s ^ 9s !';
                    const unsub3: string = '70s ^ 20s !';
                    const testValues: any = {
                        a: {},
                    };
                    expectObservable(foreverStream$, unsub).toBe('a 14999ms a 14999ms a 14999ms a ', testValues);
                    expectObservable(foreverStream$, unsub2).toBe('30s a', testValues);
                    expectObservable(foreverStream$, unsub3).toBe('70s a 14999ms a', testValues);
                });
            });
        });
    });
});
