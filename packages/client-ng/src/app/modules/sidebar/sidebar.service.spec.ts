/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { waitForAsync, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { SidebarService } from './sidebar.service';
// import sinon from "sinon";
describe('src/app/services/sidebar.service', (): void => {
    describe('SidebarService', (): void => {
        let sidebarService: SidebarService;
        let nextSpy: jasmine.Spy<jasmine.Func>;
        let subject: BehaviorSubject<boolean>;
        beforeAll((): void => {
            nextSpy = jasmine.createSpy();
        });
        beforeEach(waitForAsync((): void => {
            TestBed.configureTestingModule({
                providers: [SidebarService],
            });
            sidebarService = TestBed.inject(SidebarService);
            subject = (sidebarService as any).mSidebarStatusSubject;
        }));

        afterEach((): void => {
            nextSpy.calls.reset();
        });

        describe('sidebarObservable', (): void => {
            it('should publish the events from the suject to the observable', (done: DoneFn): void => {
                subject.next(false);
                const cb: (err?: any) => void = (err?: any): void => {
                    expect(err).not.toBeDefined();
                    expect(nextSpy).toHaveBeenCalledTimes(4);
                    expect(nextSpy.calls.argsFor(0)).toEqual([false]);
                    expect(nextSpy.calls.argsFor(1)).toEqual([true]);
                    expect(nextSpy.calls.argsFor(2)).toEqual([false]);
                    expect(nextSpy.calls.argsFor(3)).toEqual([true]);
                    done();
                };
                sidebarService.sidebarObservable.pipe(take(4)).subscribe(nextSpy, cb, cb);
                subject.next(true);
                subject.next(false);
                subject.next(true);
            });
        });
        describe('sidebarOpen', (): void => {
            describe('-- getter', (): void => {
                [true, false].forEach((testValue: boolean): void => {
                    it('should return ' + testValue, (): void => {
                        subject.next(testValue);
                        expect(sidebarService.sidebarOpen).toEqual(testValue);
                    });
                });
            });
        });
        describe('openSidebar()', (): void => {
            it('should publish a true event', (done: DoneFn): void => {
                subject.next(false);
                const cb: (err?: any) => void = (err?: any): void => {
                    expect(err).not.toBeDefined();
                    expect(nextSpy).toHaveBeenCalledTimes(2);
                    expect(nextSpy.calls.argsFor(0)).toEqual([false]);
                    expect(nextSpy.calls.argsFor(1)).toEqual([true]);
                    done();
                };
                sidebarService.sidebarObservable.pipe(take(2)).subscribe(nextSpy, cb, cb);
                sidebarService.openSidebar();
            });
        });
        describe('closeSidebar()', (): void => {
            it('should publish a false event', (done: DoneFn): void => {
                subject.next(false);
                const cb: (err?: any) => void = (err?: any): void => {
                    expect(err).not.toBeDefined();
                    expect(nextSpy).toHaveBeenCalledTimes(2);
                    expect(nextSpy.calls.argsFor(0)).toEqual([false]);
                    expect(nextSpy.calls.argsFor(1)).toEqual([false]);
                    done();
                };
                sidebarService.sidebarObservable.pipe(take(2)).subscribe(nextSpy, cb, cb);
                sidebarService.closeSidebar();
            });
        });
        describe('toggleSidebar()', (): void => {
            it('should publish a false event', (done: DoneFn): void => {
                subject.next(false);
                const cb: (err?: any) => void = (err?: any): void => {
                    expect(err).not.toBeDefined();
                    expect(nextSpy).toHaveBeenCalledTimes(3);
                    expect(nextSpy.calls.argsFor(0)).toEqual([false]);
                    expect(nextSpy.calls.argsFor(1)).toEqual([true]);
                    expect(nextSpy.calls.argsFor(2)).toEqual([false]);
                    done();
                };
                sidebarService.sidebarObservable.pipe(take(3)).subscribe(nextSpy, cb, cb);
                sidebarService.toggleSidebar();
                sidebarService.toggleSidebar();
            });
        });
    });
});
