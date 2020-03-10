import { IStopPassage } from '@donmahallem/trapeze-api-types';
import { of } from 'rxjs';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { delay } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { StopMapHeaderService } from './stop-map-header.service';
describe('src/app/modules/common/map-header-box/vehicle-map-header.service.ts', () => {
    describe('VehicleMapHeaderService', () => {
        let testScheduler: TestScheduler;
        beforeEach(() => {
            testScheduler = new TestScheduler((actual: any, expected: any): void => {
                expect(actual).toEqual(expected);
            });
        });
        describe('pollStopLocation(source)', () => {

            const filterStopSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('filterStop');
            let testService: StopMapHeaderService;
            beforeAll(() => {
                testService = new StopMapHeaderService({
                    filterStop: filterStopSpy,
                } as any);
            });
            afterEach(() => {
                filterStopSpy.calls.reset();
            });
            it('should emit undefined if trip is not defined', () => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    // tslint:disable-next-line:no-null-keyword
                    const e1: ColdObservable<IStopPassage> = cold('-a--b--a---|', { a: undefined, b: null });
                    const subs: string = '^----------!';
                    const expected: string = '-a--a--a---|';

                    expectObservable(testService.pollStopLocation(e1)).toBe(expected, { a: undefined });
                    expectSubscriptions(e1.subscriptions).toBe(subs);
                });
                expect(filterStopSpy).toHaveBeenCalledTimes(0);
            });
            it('should skip inflight api requests with switchMap', () => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    filterStopSpy.and.callFake((inp: any) =>
                        of(inp).pipe(delay(100, testScheduler)));
                    // tslint:disable-next-line:no-null-keyword
                    const e1: ColdObservable<any> = cold('a 50ms b 120ms c|', {
                        a: { stopShortName: 8 },
                        b: { stopShortName: 9 },
                        c: { stopShortName: 10 },
                    });
                    const subs: string = '^ 172ms !';
                    const expected: string = '151ms b 120ms (c|)';

                    expectObservable(testService.pollStopLocation(e1)).toBe(expected, { a: 8, b: 9, c: 10 });
                    expectSubscriptions(e1.subscriptions).toBe(subs);
                });
                expect(filterStopSpy).toHaveBeenCalledTimes(3);
                expect(filterStopSpy.calls.allArgs()).toEqual([[8], [9], [10]]);
            });
            it('should emit results from the api', () => {
                testScheduler.run((helpers: RunHelpers): void => {
                    filterStopSpy.and.callFake((id: any) =>
                        of(id));
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    const e1: ColdObservable<IStopPassage> = cold('-a--b--a---|', {
                        a: { stopShortName: 1 } as any,
                        b: { stopShortName: 4 } as any,
                    });
                    const subs: string = '^----------!';
                    const expected: string = '-a--b--a---|';

                    expectObservable(testService.pollStopLocation(e1)).toBe(expected, { a: 1, b: 4 });
                    expectSubscriptions(e1.subscriptions).toBe(subs);
                });
                expect(filterStopSpy).toHaveBeenCalledTimes(3);
                expect(filterStopSpy.calls.allArgs()).toEqual([[1], [4], [1]]);
            });
        });
    });
});
