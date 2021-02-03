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
import { PollResult } from '../operators';
import { intervallPollVehicles } from './intervall-poll-vehicles';

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
console.log(testParameter);
describe('observable/intervall-poll-vehicles', (): void => {
    describe('intervallPollVehicles', (): void => {
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
        it('should pass on all parameters correctly', (): void => {
            testScheduler.run((helpers: RunHelpers): void => {
                const { expectObservable, flush, cold } = helpers;
                // Omitting this arg may crash the test suite.
                const unsub: string = '14ms ^ 250ms !';
                const testValues: any = {
                    a: {
                        result: testResponses.d,
                        type: 'success',
                    },
                    b: {
                        result: testResponses.e,
                        type: 'success',
                    },
                };
                const queryFacStub: sinon.SinonStub = sandbox.stub();
                const coldTest: Observable<IVehicleLocationList> = cold<IVehicleLocationList>('---d--e|', testResponses);
                queryFacStub.returns(coldTest);
                const testObservable: Observable<PollResult> = intervallPollVehicles(queryFacStub, 100);
                expectObservable(testObservable, unsub).toBe('17ms a--b 103ms a--b 103ms a--b', testValues);
                flush();
                expect(queryFacStub.callCount).to.equal(3);
                expect(queryFacStub.args).to.deep.equal([[0], [2000], [2000]]);
            });
        });
        it('should not cancel on error', (): void => {
            testScheduler.run((helpers: RunHelpers): void => {
                const { expectObservable, flush, cold } = helpers;
                // Omitting this arg may crash the test suite.
                const unsub: string = '14ms ^ 250ms !';
                const testError: Error = new Error('test error');
                const testValues: any = {
                    a: {
                        result: testResponses.d,
                        type: 'success',
                    },
                    b: {
                        error: testError,
                        type: 'error',
                    },
                };
                const queryFacStub: sinon.SinonStub = sandbox.stub();
                const coldTest: Observable<IVehicleLocationList> = cold<IVehicleLocationList>('---d--#',
                    testResponses,
                    testError);
                queryFacStub.returns(coldTest);
                const testObservable: Observable<PollResult> = intervallPollVehicles(queryFacStub, 100);
                expectObservable(testObservable, unsub).toBe('17ms a--b 102ms a--b 102ms a--b', testValues);
                flush();
                expect(queryFacStub.callCount).to.equal(3);
                expect(queryFacStub.args).to.deep.equal([[0], [1000], [1000]]);
            });
        });
    });
});
