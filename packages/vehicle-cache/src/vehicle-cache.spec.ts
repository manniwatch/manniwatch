/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { VehicleCache } from './vehicle-cache';

describe('vehicle-cache', (): void => {
    describe('VehicleCache', (): void => {
        let sandbox: sinon.SinonSandbox;
        let testCache: VehicleCache;
        before((): void => {
            sandbox = sinon.createSandbox();
        });
        beforeEach((): void => {
            testCache = new VehicleCache();
        });
        afterEach((): void => {
            testCache.close();
            sandbox.reset();
        });
        it('should constantly poll', (): void => {
            testCache.update({ id: "1" } as any);
            testCache.update({ id: "2" } as any);
            testCache.update({ id: "1", isDeleted: true } as any);
            expect(testCache.getState()).to.deep.equal([
                { id: "2" }
            ])
        });
        describe('check if close check is working', (): void => {
            const keys: (keyof VehicleCache)[] = ['update', 'updateMultiple', 'getState'];
            beforeEach((): void => {
                testCache.close();
            });
            keys.forEach((key: string): void => {
                it(`should throw error for method '${key}()'`, (): void => {
                    expect((): void => {
                        testCache[key]();
                    }).to.throw('The cache has been closed');
                });
            });
        })
    });
});
