/**
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { expect } from 'chai';
import 'mocha';
import { Done } from 'mocha';
import { tap } from 'rxjs/operators';
import sinon from 'sinon';
import { VehicleCache } from './vehicle-cache.js';

/* eslint-disable @typescript-eslint/no-explicit-any, mocha/no-setup-in-describe*/
describe('vehicle-cache', function (): void {
    describe('VehicleCache', function (): void {
        let sandbox: sinon.SinonSandbox;
        let testCache: VehicleCache;

        before(function (): void {
            sandbox = sinon.createSandbox();
        });

        beforeEach(function (): void {
            testCache = new VehicleCache();
        });

        afterEach(function (): void {
            testCache.close();
            sandbox.reset();
        });

        it('should constantly poll', function (): void {
            testCache.update({ id: '1' } as any);
            testCache.update({ id: '2' } as any);
            testCache.update({ id: '1', isDeleted: true } as any);
            expect(testCache.getState()).to.deep.equal([{ id: '2' }]);
        });

        describe('check if close check is working', function (): void {
            const keys: (keyof VehicleCache)[] = ['update', 'updateMultiple', 'getState'];

            beforeEach(function (): void {
                testCache.close();
            });
            keys.forEach((key: string): void => {
                it(`should throw error for method '${key}()'`, function (): void {
                    expect((): void => {
                        testCache[key]();
                    }).to.throw('The cache has been closed');
                });
            });
        });

        describe('check delete event stream', function (): void {
            let nextSpy: sinon.SinonSpy;

            before(function (): void {
                nextSpy = sandbox.spy();
            });

            it(`should emit 'del' events`, function (done: Done): void {
                testCache.eventObservable
                    .pipe(
                        tap({
                            complete: (): void => {
                                expect(nextSpy.callCount).to.equal(3);
                                expect(nextSpy.args).to.deep.equal([
                                    [{ location: { id: '1' }, type: 'update' }],
                                    [{ location: { id: '2' }, type: 'update' }],
                                    [{ location: { id: '1' }, type: 'delete' }],
                                ]);
                            },
                        })
                    )
                    .subscribe(nextSpy, done, done);
                testCache.update({ id: '1' } as any);
                testCache.update({ id: '2' } as any);
                testCache.update({ id: '1', isDeleted: true } as any);
                testCache.close();
            });

            it(`should emit 'del' events correctly for multi update`, function (done: Done): void {
                testCache.eventObservable
                    .pipe(
                        tap({
                            complete: (): void => {
                                expect(nextSpy.callCount).to.equal(3);
                                expect(nextSpy.args).to.deep.equal([
                                    [{ location: { id: '1' }, type: 'update' }],
                                    [{ location: { id: '2' }, type: 'update' }],
                                    [{ location: { id: '1' }, type: 'delete' }],
                                ]);
                            },
                        })
                    )
                    .subscribe(nextSpy, done, done);
                testCache.updateMultiple([{ id: '1' }, { id: '2' }, { id: '1', isDeleted: true }] as any[]);
                testCache.close();
            });
        });
    });
});
