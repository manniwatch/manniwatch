/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { TripId } from '@manniwatch/api-types';
import { of, throwError } from 'rxjs';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { RunHelpers } from 'rxjs/internal/testing/TestScheduler';
import { delay } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { TripInfoWithId } from 'src/app/services';
import { VehicleMapHeaderService } from './vehicle-map-header.service';
describe('src/app/modules/common/map-header-box/vehicle-map-header.service.ts', () => {
    describe('VehicleMapHeaderService', () => {
        let testScheduler: TestScheduler;
        beforeEach(() => {
            testScheduler = new TestScheduler((actual: any, expected: any): void => {
                expect(actual).toEqual(expected);
            });
        });
        describe('createVehicleDataObservable()', () => {

            let pollVehicleLocationSpy: jasmine.Spy<jasmine.Func>;
            let pollVehicleRouteSpy: jasmine.Spy<jasmine.Func>;
            let testService: VehicleMapHeaderService;

            beforeAll(() => {
                testService = new VehicleMapHeaderService(undefined, undefined);
                pollVehicleLocationSpy = spyOn(testService, 'pollVehicleLocation');
                pollVehicleRouteSpy = spyOn(testService, 'pollVehicleRoute');
            });
            afterEach(() => {
                pollVehicleLocationSpy.calls.reset();
                pollVehicleRouteSpy.calls.reset();
            });
            it('should emit undefined if trip is not defined', () => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    const vehicleObservable: ColdObservable<TripInfoWithId> = cold('a-b 200ms c|', {
                        a: undefined,
                        b: 1 as any,
                        c: 2 as any,
                    });
                    const routeObservable: ColdObservable<TripInfoWithId> = cold('a 120ms b 120ms c|', {
                        a: undefined,
                        b: 'a' as any,
                        c: 'b' as any,
                    });
                    pollVehicleLocationSpy.and.returnValue(vehicleObservable);
                    pollVehicleRouteSpy.and.returnValue(routeObservable);
                    const vehicleSubs: string = '^ 203ms !';
                    const routeSubs: string = '^ 242ms !';
                    const expected: string = '100ms a 120ms b 21ms |';
                    expectObservable(testService.createVehicleDataObservable()).toBe(expected, {
                        a: {
                            location: 1,
                            route: undefined,
                        },
                        b: {
                            location: 2,
                            route: 'a',
                        },
                    });
                    expectSubscriptions(vehicleObservable.subscriptions).toBe(vehicleSubs);
                    expectSubscriptions(routeObservable.subscriptions).toBe(routeSubs);
                });
            });
        });
        describe('pollVehicleLocation(source)', () => {

            const getVehicleByTripIdSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('getVehicleByTripId');
            let testService: VehicleMapHeaderService;
            beforeAll(() => {
                testService = new VehicleMapHeaderService({
                    getVehicleByTripId: getVehicleByTripIdSpy,
                } as any, undefined);
            });
            afterEach(() => {
                getVehicleByTripIdSpy.calls.reset();
            });
            it('should emit undefined if trip is not defined', () => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    // tslint:disable-next-line:no-null-keyword
                    const e1: ColdObservable<TripInfoWithId> = cold('-a--b--a---|', { a: undefined, b: null });
                    const subs: string = '^----------!';
                    const expected: string = '-a---------|';

                    expectObservable(testService.pollVehicleLocation(e1)).toBe(expected, { a: undefined });
                    expectSubscriptions(e1.subscriptions).toBe(subs);
                });
                expect(getVehicleByTripIdSpy).toHaveBeenCalledTimes(0);
            });
            it('should emit only distinct vehicle results', () => {
                testScheduler.run((helpers: RunHelpers): void => {
                    getVehicleByTripIdSpy.and.callFake((a: TripId) => {
                        switch (a) {
                            case 1:
                                return of({ tripId: 1, lastUpdate: 1 });
                            case 2:
                                return of({ tripId: 1, lastUpdate: 2 });
                            case 4:
                                return of({ tripId: 4, lastUpdate: 3 });
                            default:
                                return throwError(new Error('should not be called'));
                        }
                    });
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    const e1: ColdObservable<TripInfoWithId> = cold('-d-d-a--b--a-a--c-a-d|', {
                        a: { tripId: 1 } as any,
                        b: { tripId: 2 } as any,
                        c: { tripId: 4 } as any,
                        d: undefined,
                    });
                    const subs: string = '^--------------------!';
                    const expected: string = '-d---a--b--a----c-a-d|';

                    expectObservable(testService.pollVehicleLocation(e1))
                        .toBe(expected, {
                            a: { tripId: 1, lastUpdate: 1 },
                            b: { tripId: 1, lastUpdate: 2 },
                            c: { tripId: 4, lastUpdate: 3 },
                            d: undefined,
                        });
                    expectSubscriptions(e1.subscriptions).toBe(subs);
                });
                expect(getVehicleByTripIdSpy).toHaveBeenCalledTimes(6);
                expect(getVehicleByTripIdSpy.calls.allArgs()).toEqual([[1], [2], [1], [1], [4], [1]]);
            });
        });
        describe('pollVehicleRoute(source)', () => {

            const getRouteByTripIdSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('getRouteByTripId');
            let testService: VehicleMapHeaderService;
            beforeAll(() => {
                testService = new VehicleMapHeaderService(undefined, {
                    getRouteByTripId: getRouteByTripIdSpy,
                } as any);
            });
            afterEach(() => {
                getRouteByTripIdSpy.calls.reset();
            });
            it('should emit undefined if trip is not defined', () => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    // tslint:disable-next-line:no-null-keyword
                    const e1: ColdObservable<TripInfoWithId> = cold('-a--b--a---|', { a: undefined, b: null });
                    const subs: string = '^----------!';
                    const expected: string = '-a--a--a---|';

                    expectObservable(testService.pollVehicleRoute(e1)).toBe(expected, { a: undefined });
                    expectSubscriptions(e1.subscriptions).toBe(subs);
                });
                expect(getRouteByTripIdSpy).toHaveBeenCalledTimes(0);
            });
            it('should skip inflight api requests with switchMap', () => {
                testScheduler.run((helpers: RunHelpers): void => {
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    getRouteByTripIdSpy.and.callFake((inp: any) =>
                        of(inp).pipe(delay(100, testScheduler)));
                    // tslint:disable-next-line:no-null-keyword
                    const e1: ColdObservable<any> = cold('a 50ms b 120ms c|', {
                        a: { tripId: 8 },
                        b: { tripId: 9 },
                        c: { tripId: 10 },
                    });
                    const subs: string = '^ 172ms !';
                    const expected: string = '151ms b 120ms (c|)';

                    expectObservable(testService.pollVehicleRoute(e1)).toBe(expected, { a: 8, b: 9, c: 10 });
                    expectSubscriptions(e1.subscriptions).toBe(subs);
                });
                expect(getRouteByTripIdSpy).toHaveBeenCalledTimes(3);
                expect(getRouteByTripIdSpy.calls.allArgs()).toEqual([[8], [9], [10]]);
            });
            it('should emit undefined if the api errors', () => {
                const testError: Error = new Error('this is a test error');
                testScheduler.run((helpers: RunHelpers): void => {
                    getRouteByTripIdSpy.and.callFake(() =>
                        throwError(testError));
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    const e1: ColdObservable<TripInfoWithId> = cold('-a--b--a---|', {
                        a: { tripId: 1 } as any,
                        b: { tripId: 4 } as any,
                    });
                    const subs: string = '^----------!';
                    const expected: string = '-a--a--a---|';

                    expectObservable(testService.pollVehicleRoute(e1)).toBe(expected, { a: undefined });
                    expectSubscriptions(e1.subscriptions).toBe(subs);
                });
                expect(getRouteByTripIdSpy).toHaveBeenCalledTimes(3);
                expect(getRouteByTripIdSpy.calls.allArgs()).toEqual([[1], [4], [1]]);
            });
            it('should emit results from the api', () => {
                testScheduler.run((helpers: RunHelpers): void => {
                    getRouteByTripIdSpy.and.callFake((id: TripId) =>
                        of(id));
                    const { cold, expectObservable, expectSubscriptions } = helpers;
                    const e1: ColdObservable<TripInfoWithId> = cold('-a--b--a---|', {
                        a: { tripId: 1 } as any,
                        b: { tripId: 4 } as any,
                    });
                    const subs: string = '^----------!';
                    const expected: string = '-a--b--a---|';

                    expectObservable(testService.pollVehicleRoute(e1)).toBe(expected, { a: 1, b: 4 });
                    expectSubscriptions(e1.subscriptions).toBe(subs);
                });
                expect(getRouteByTripIdSpy).toHaveBeenCalledTimes(3);
                expect(getRouteByTripIdSpy.calls.allArgs()).toEqual([[1], [4], [1]]);
            });
        });
    });
});
