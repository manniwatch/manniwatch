/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { defer, EMPTY, Observable, of } from 'rxjs';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { RunHelpers, TestScheduler } from 'rxjs/testing';
import { AppDialogService } from '../services';
import { RetryResolver } from './retry-resolver';

class TestRetryResolver extends RetryResolver<string> {
    public createLoader(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
        return undefined;
    }
}
const TEST_ID = 'test_id';
describe('src/app/util/retry-resolver', (): void => {
    describe('RetryResolver', (): void => {
        let resolver: TestRetryResolver;
        let createLoaderSpy: jasmine.Spy<TestRetryResolver['createLoader']>;
        let routerSpy: jasmine.SpyObj<Router>;
        let dialogSpy: jasmine.SpyObj<AppDialogService>;
        beforeEach((): void => {
            routerSpy = jasmine.createSpyObj(Router, ['navigate']);
            dialogSpy = jasmine.createSpyObj(AppDialogService, ['getRetryDialog']);
            resolver = new TestRetryResolver(routerSpy, dialogSpy);
            createLoaderSpy = spyOn(resolver, 'createLoader');
        });

        afterEach((): void => {
            createLoaderSpy.calls.reset();
        });

        describe('resolve(route, state)', (): void => {
            let testScheduler: TestScheduler;
            beforeEach((): void => {
                testScheduler = new TestScheduler((actual, expected) => {
                    expect(actual).toEqual(expected);
                });
            });
            it('should construct the request correctly', (): void => {
                testScheduler.run((helpers: RunHelpers) => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    const e1: ColdObservable<string> = cold(' -a--b--c---|');
                    createLoaderSpy.and.returnValue(e1);
                    const e1subs = '  ^----------!';
                    const expected = '-a--b--c---|';

                    expectObservable(resolver.resolve({ params: { stopId: TEST_ID } } as any, undefined)).toBe(expected);
                    expectSubscriptions(e1.subscriptions).toBe(e1subs);
                });
                expect(dialogSpy.getRetryDialog.calls.count()).toEqual(0, 'No Dialog should be shown');
            });
            it('should pass on an normal exception', (): void => {
                const testError: Error = new Error('Test Error');
                testScheduler.run((helpers: RunHelpers) => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    const e1: ColdObservable<string> = cold(' -#', undefined, testError);
                    createLoaderSpy.and.returnValue(e1);
                    const e1subs = '  ^!';
                    const expected = '-#';

                    expectObservable(resolver.resolve({ params: { stopId: TEST_ID } } as any, undefined)).toBe(
                        expected,
                        undefined,
                        testError
                    );
                    expectSubscriptions(e1.subscriptions).toBe(e1subs);
                });
                expect(dialogSpy.getRetryDialog.calls.count()).toEqual(0, 'No Dialog should be shown');
            });
            describe('HttpErrorResponse', (): void => {
                let utilNavigateSpy: jasmine.Spy<TestRetryResolver['navigate']>;
                beforeEach((): void => {
                    utilNavigateSpy = spyOn(resolver, 'navigate');
                });
                afterEach((): void => {
                    utilNavigateSpy.calls.reset();
                });
                it('should navigate to 404 route on 404 status', (): void => {
                    const testError: HttpErrorResponse = new HttpErrorResponse({
                        status: 404,
                        statusText: 'Test status',
                    });
                    routerSpy.navigate.and.resolveTo(true);
                    dialogSpy.getRetryDialog.and.returnValue(EMPTY);
                    testScheduler.run((helpers: RunHelpers) => {
                        const { cold, expectObservable, expectSubscriptions, flush } = helpers;
                        const e1: ColdObservable<string> = cold(' -#', undefined, testError);
                        const e2: ColdObservable<boolean> = cold<boolean>(' -a|', { a: true });
                        createLoaderSpy.and.returnValue(e1);
                        utilNavigateSpy.and.returnValue(e2);
                        const expected = '--';
                        expectObservable(resolver.resolve({ params: { stopId: TEST_ID } } as any, undefined)).toBe(expected);
                        flush();
                        expectSubscriptions(e1.subscriptions).toBe('  ^!');
                        expectSubscriptions(e2.subscriptions).toBe('  -^-!');
                    });
                    expect(dialogSpy.getRetryDialog.calls.count()).toEqual(0, 'No Dialog should be shown');
                });
                it('should retry once and succeed', (): void => {
                    const testError: HttpErrorResponse = new HttpErrorResponse({
                        status: 500,
                        statusText: 'Test status',
                    });
                    dialogSpy.getRetryDialog.and.returnValue(of(true));
                    testScheduler.run((helpers: RunHelpers) => {
                        const { cold, expectObservable, expectSubscriptions, flush } = helpers;
                        const e1: ColdObservable<string> = cold(' -#', undefined, testError);
                        const e2: ColdObservable<string> = cold(' -a|');
                        createLoaderSpy.and.callFake((): Observable<string> => {
                            let count = 0;

                            return defer(() => {
                                count++;
                                return count <= 1 ? e1 : e2;
                            });
                        });
                        const expected = '--a|';

                        expectObservable(resolver.resolve({ params: { stopId: TEST_ID } } as any, undefined)).toBe(expected);
                        flush();
                        expectSubscriptions(e1.subscriptions).toBe('^!');
                        expectSubscriptions(e2.subscriptions).toBe('-^-!');
                    });
                    expect(dialogSpy.getRetryDialog.calls.count()).toEqual(1, 'No Dialog should be shown');
                });
                it('should pass on original error if dialog is denied', (): void => {
                    const testError: HttpErrorResponse = new HttpErrorResponse({
                        status: 500,
                        statusText: 'Test status',
                    });
                    dialogSpy.getRetryDialog.and.returnValue(of(false));
                    testScheduler.run((helpers: RunHelpers) => {
                        const { cold, expectObservable, expectSubscriptions, flush } = helpers;
                        const e1: ColdObservable<string> = cold(' -#', undefined, testError);
                        createLoaderSpy.and.callFake((): Observable<string> => e1);
                        const expected = '-#';

                        expectObservable(resolver.resolve({ params: { stopId: TEST_ID } } as any, undefined)).toBe(
                            expected,
                            undefined,
                            testError
                        );
                        flush();
                        expectSubscriptions(e1.subscriptions).toBe('^!');
                    });
                    expect(dialogSpy.getRetryDialog.calls.count()).toEqual(1, 'No Dialog should be shown');
                });
            });
        });
    });
});
