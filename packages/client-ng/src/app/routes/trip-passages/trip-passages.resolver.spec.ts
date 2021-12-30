/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { TripInfoWithId } from '@manniwatch/client-types';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { RunHelpers, TestScheduler } from 'rxjs/testing';
import { ApiService } from 'src/app/services';
import { TripPassagesResolver } from './trip-passages.resolver';

describe('src/app/routes/stop/stop-info-resolver', (): void => {
    describe('StopInfoResolver', (): void => {
        let resolver: TripPassagesResolver;
        let apiSpyObj: jasmine.SpyObj<ApiService>;
        beforeEach((): void => {
            apiSpyObj = jasmine.createSpyObj(ApiService, ['getTripPassages']);
            resolver = new TripPassagesResolver(apiSpyObj, undefined, undefined);
        });

        describe('createLoader(route, state)', (): void => {
            let testScheduler: TestScheduler;
            let jasmineClk: jasmine.Clock;
            const expectedObservableResults: { [key: string]: object } = {
                a: { failures: 0, status: 2, timestamp: 973810800000, tripId: undefined, tripInfo: 'a' },
                b: { failures: 0, status: 2, timestamp: 973810800000, tripId: undefined, tripInfo: 'b' },
                c: { failures: 0, status: 2, timestamp: 973810800000, tripId: undefined, tripInfo: 'c' },
            };
            beforeEach((): void => {
                jasmineClk = jasmine.clock().install();
                jasmineClk.mockDate(new Date(2000, 10, 10));
                testScheduler = new TestScheduler((actual, expected) => {
                    expect(actual).toEqual(expected);
                });
            });
            afterEach(function () {
                jasmineClk.uninstall();
            });
            it('should pass on api results correctly', (): void => {
                testScheduler.run((helpers: RunHelpers) => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    const e1: ColdObservable<TripInfoWithId> = cold(' -a--b--c---|');
                    const e1subs = '  ^----------!';
                    const expected = '-a--b--c---|';
                    apiSpyObj.getTripPassages.and.returnValue(e1);
                    expectObservable(resolver.createLoader({ params: { tripId: 'testId' } } as any, undefined)).toBe(
                        expected,
                        expectedObservableResults
                    );
                    expectSubscriptions(e1.subscriptions).toBe(e1subs);
                });
                expect(apiSpyObj.getTripPassages.calls.count()).toEqual(1);
                expect(apiSpyObj.getTripPassages.calls.first().args).toEqual(['testId']);
            });
            it('should pass on api errors correctly', (): void => {
                testScheduler.run((helpers: RunHelpers) => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    const e1: ColdObservable<TripInfoWithId> = cold(' -a--#');
                    const e1subs = '  ^---!';
                    const expected = '-a--#';
                    apiSpyObj.getTripPassages.and.returnValue(e1);
                    expectObservable(resolver.createLoader({ params: { tripId: 'testId' } } as any, undefined)).toBe(
                        expected,
                        expectedObservableResults
                    );
                    expectSubscriptions(e1.subscriptions).toBe(e1subs);
                });
                expect(apiSpyObj.getTripPassages.calls.count()).toEqual(1);
                expect(apiSpyObj.getTripPassages.calls.first().args).toEqual(['testId']);
            });
        });
    });
});
