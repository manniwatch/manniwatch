/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { IStopPassage } from '@manniwatch/api-types';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { RunHelpers, TestScheduler } from 'rxjs/testing';
import { ApiService } from 'src/app/services';
import { StopInfoResolver } from './stop-info.resolver';

describe('src/app/routes/stop/stop-info-resolver', (): void => {
    describe('StopInfoResolver', (): void => {
        let resolver: StopInfoResolver;
        let apiSpyObj: jasmine.SpyObj<ApiService>;
        beforeEach((): void => {
            apiSpyObj = jasmine.createSpyObj(ApiService, ['getStopPassages']);
            resolver = new StopInfoResolver(apiSpyObj, undefined, undefined);
        });

        describe('createLoader(route, state)', (): void => {
            let testScheduler: TestScheduler;
            beforeEach((): void => {
                testScheduler = new TestScheduler((actual, expected) => {
                    expect(actual).toEqual(expected);
                });
            });
            it('should pass on api results correctly', (): void => {
                testScheduler.run((helpers: RunHelpers) => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    const e1: ColdObservable<IStopPassage> = cold(' -a--b--c---|');
                    const e1subs = '  ^----------!';
                    const expected = '-a--b--c---|';
                    apiSpyObj.getStopPassages.and.returnValue(e1);
                    expectObservable(resolver.createLoader({ params: { stopId: 'testId' } } as any, undefined)).toBe(expected);
                    expectSubscriptions(e1.subscriptions).toBe(e1subs);
                });
                expect(apiSpyObj.getStopPassages.calls.count()).toEqual(1);
                expect(apiSpyObj.getStopPassages.calls.first().args).toEqual(['testId']);
            });
            it('should pass on api errors correctly', (): void => {
                testScheduler.run((helpers: RunHelpers) => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    const e1: ColdObservable<IStopPassage> = cold(' -a--#');
                    const e1subs = '  ^---!';
                    const expected = '-a--#';
                    apiSpyObj.getStopPassages.and.returnValue(e1);
                    expectObservable(resolver.createLoader({ params: { stopId: 'testId' } } as any, undefined)).toBe(expected);
                    expectSubscriptions(e1.subscriptions).toBe(e1subs);
                });
                expect(apiSpyObj.getStopPassages.calls.count()).toEqual(1);
                expect(apiSpyObj.getStopPassages.calls.first().args).toEqual(['testId']);
            });
        });
    });
});
