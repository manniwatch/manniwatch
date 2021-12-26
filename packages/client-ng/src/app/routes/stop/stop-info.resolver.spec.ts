/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { HttpErrorResponse } from '@angular/common/http';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { from, throwError, Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { StopInfoResolver } from './stop-info.resolver';
// import sinon from "sinon";

describe('src/app/modules/stop/stop-info.resolver', (): void => {
    describe('StopInfoResolver', (): void => {
        let resolver: StopInfoResolver;
        let getSpy: jasmine.Spy<jasmine.Func>;
        let nextSpy: jasmine.Spy<jasmine.Func>;
        let navigateSpy: jasmine.Spy<jasmine.Func>;
        const testId = '239jmcntest';
        beforeAll((): void => {
            getSpy = jasmine.createSpy();
            navigateSpy = jasmine.createSpy();
            nextSpy = jasmine.createSpy();
        });
        beforeEach(
            waitForAsync((): void => {
                TestBed.configureTestingModule({
                    providers: [
                        StopInfoResolver,
                        {
                            provide: ApiService,
                            useValue: {
                                getStopPassages: getSpy,
                            },
                        },
                        {
                            provide: Router,
                            useValue: {
                                navigate: navigateSpy,
                            },
                        },
                    ],
                });
                resolver = TestBed.inject(StopInfoResolver);
            })
        );

        afterEach((): void => {
            getSpy.calls.reset();
            nextSpy.calls.reset();
            navigateSpy.calls.reset();
        });

        describe('resolve(route, state)', (): void => {
            describe('should succeed', (): void => {
                beforeEach((): void => {
                    getSpy.and.callFake((...args: any[]): Observable<any> => from([args]));
                });
                it('should construct the request correctly', (done: DoneFn): void => {
                    resolver.resolve({ params: { stopId: testId } } as any, undefined).subscribe(nextSpy, done.fail, done);
                });
                afterEach((): void => {
                    expect(nextSpy.calls.count()).toEqual(1);
                    expect(nextSpy.calls.first().args[0]).toEqual([testId]);
                    expect(navigateSpy.calls.count()).toEqual(0);
                });
            });
            describe('should not navigate for generic error', (): void => {
                const testError: Error = new Error('test error');
                beforeEach((): void => {
                    getSpy.and.callFake((...args: any[]): Observable<any> => throwError(testError));
                });
                it('should construct the request correctly', (done: DoneFn): void => {
                    resolver.resolve({ params: { tripId: testId } } as any, undefined).subscribe(nextSpy, done.fail, done);
                });
                afterEach((): void => {
                    expect(nextSpy.calls.count()).toEqual(0);
                    expect(navigateSpy.calls.count()).toEqual(0);
                });
            });
            describe('should navigate for 404 error', (): void => {
                const testError: HttpErrorResponse = new HttpErrorResponse({
                    status: 404,
                });
                beforeEach((): void => {
                    getSpy.and.callFake((...args: any[]): Observable<any> => throwError(() => testError));
                });
                it('should construct the request correctly', (done: DoneFn): void => {
                    resolver.resolve({ params: { tripId: testId } } as any, undefined).subscribe({
                        complete: done,
                        error: done.fail,
                        next: nextSpy,
                    });
                });
                afterEach((): void => {
                    expect(nextSpy.calls.count()).toEqual(0);
                    expect(navigateSpy.calls.count()).toEqual(1);
                });
            });
        });
    });
});
