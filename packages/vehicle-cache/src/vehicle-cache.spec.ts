/*
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { expect } from 'chai';
import 'mocha';
import { Done } from 'mocha';
import { tap } from 'rxjs/operators';
import sinon from 'sinon';
import { VehicleCache } from './vehicle-cache.js';

/* eslint-disable @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-unsafe-assignment */
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
            testCache.update({ id: '1' } as any);
            testCache.update({ id: '2' } as any);
            testCache.update({ id: '1', isDeleted: true } as any);
            expect(testCache.getState()).to.deep.equal([{ id: '2' }]);
        });
        describe('check if close check is working', (): void => {
            const keys: (keyof VehicleCache)[] = ['update', 'updateMultiple', 'getState'];
            beforeEach((): void => {
                testCache.close();
            });
            keys.forEach((key: string): void => {
                it(`should throw error for method '${key}()'`, (): void => {
                    expect((): void => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        testCache[key]();
                    }).to.throw('The cache has been closed');
                });
            });
        });
        describe('check delete event stream', (): void => {
            let nextSpy: sinon.SinonSpy;
            before((): void => {
                nextSpy = sandbox.spy();
            });
            it(`should emit 'del' events`, (done: Done): void => {
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
            it(`should emit 'del' events correctly for multi update`, (done: Done): void => {
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
