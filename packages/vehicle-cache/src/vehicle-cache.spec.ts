/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { expect } from 'chai';
import 'mocha';
import { TestScheduler } from 'rxjs/testing';
import * as sinon from 'sinon';
import { VehicleCache } from './vehicle-cache';

describe('vehicle-cache', (): void => {
    describe('VehicleCache', (): void => {
        let testScheduler: TestScheduler;
        let testInstance: VehicleCache;
        let sandbox: sinon.SinonSandbox;
        before((): void => {
            sandbox = sinon.createSandbox();
        });
        beforeEach((): void => {
            testInstance = new VehicleCache(undefined as any);
            testScheduler = new TestScheduler((actual: any, expected: any): void => {
                // asserting the two objects are equal
                // e.g. using chai.
                expect(actual).deep.equal(expected);
            });
        });
        afterEach((): void => {
            sandbox.resetHistory();
        });
        describe('safeQueryData()', (): void => {
            it('needs impl');
        });
    });
});
