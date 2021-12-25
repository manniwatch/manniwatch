/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { RunHelpers, TestScheduler } from 'rxjs/testing';
import { SETTINGS_SERVICE_FACTORY } from './settings-service.factory';
import { SettingsService } from '.';

describe('src/app/services/settings/settings-service.facotry.ts', (): void => {
    describe('SETTINGS_SERVICE_FACTORY', (): void => {
        let cfgStub: jasmine.SpyObj<SettingsService>;
        let testScheduler: TestScheduler;
        beforeAll((): void => {
            cfgStub = jasmine.createSpyObj('SettingsService', ['load']);
            testScheduler = new TestScheduler((actual: unknown, expected: unknown): void => {
                expect(actual).toEqual(expected);
            });
        });
        it('should call the load function and return', (): void => {
            testScheduler.run((helpers: RunHelpers): void => {
                const { cold, expectObservable, expectSubscriptions } = helpers;
                const e1: ColdObservable<void> = cold(' -a---|');
                const e1subs = '  ^----!';
                const expected = '-a---|';
                cfgStub.load.and.returnValue(e1);
                expectObservable(SETTINGS_SERVICE_FACTORY(cfgStub)()).toBe(expected);
                expectSubscriptions(e1.subscriptions).toBe(e1subs);
            });
        });
    });
});
