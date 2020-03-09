/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { async, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { SidebarService } from './sidebar.service';
// import * as sinon from "sinon";
describe('src/app/services/sidebar.service', () => {
    describe('SidebarService', () => {
        let sidebarService: SidebarService;
        let nextSpy: jasmine.Spy<jasmine.Func>;
        let subject: BehaviorSubject<boolean>;
        beforeAll(() => {
            nextSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [SidebarService],
            });
            sidebarService = TestBed.get(SidebarService);
            subject = (sidebarService as any).mSidebarStatusSubject;
        }));

        afterEach(() => {
            nextSpy.calls.reset();
        });

        describe('sidebarObservable', () => {
            it('should publish the events from the suject to the observable', (done: DoneFn) => {
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
        describe('sidebarOpen', () => {
            describe('-- getter', () => {
                [true, false].forEach((testValue: boolean) => {
                    it('should return ' + testValue, () => {
                        subject.next(testValue);
                        expect(sidebarService.sidebarOpen).toEqual(testValue);
                    });
                });
            });
        });
        describe('openSidebar()', () => {
            it('should publish a true event', (done: DoneFn) => {
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
        describe('closeSidebar()', () => {
            it('should publish a false event', (done: DoneFn) => {
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
        describe('toggleSidebar()', () => {
            it('should publish a false event', (done: DoneFn) => {
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
