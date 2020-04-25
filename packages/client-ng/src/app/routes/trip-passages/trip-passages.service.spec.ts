/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { fakeAsync, tick } from '@angular/core/testing';
import { of, EMPTY, NEVER, Observable, Subject, Subscription } from 'rxjs';
import { delay, map, skip, take, toArray } from 'rxjs/operators';
import { TripPassagesService } from './trip-passages.service';
import { IPassageStatus, TripPassagesUtil, UpdateStatus } from './trip-util';

type PartialPassageStatus = Partial<IPassageStatus>;
describe('src/app/modules/trip-passages/trip-passages.service', (): void => {
    describe('TripPassagesService', (): void => {
        const initialTripData: any = {
            id: 'tripId1',
        };
        const initialRouteData: any = {
            tripPassages: initialTripData,
        };
        describe('constructor()', (): void => {
            const routeDataSubject: Subject<any> = new Subject();
            let createStatusObservableSpy: jasmine.Spy<jasmine.Func>;
            const refreshSubject: Subject<any> = new Subject();
            const testRoute: any = {
                data: routeDataSubject.asObservable(),
                snapshot: { data: initialRouteData },
            };
            beforeEach((): void => {
                createStatusObservableSpy = spyOn(TripPassagesService.prototype, 'createStatusObservable');
                createStatusObservableSpy.and.returnValue(refreshSubject);
            });
            afterEach((): void => {
                createStatusObservableSpy.calls.reset();
            });
            describe('statusSubject should be set by route data', (): void => {
                it('statusSubject should be initialized with route snapshot data', (doneFn: DoneFn): void => {
                    const service: TripPassagesService = new TripPassagesService(testRoute, undefined, undefined);
                    (service as any).statusSubject
                        .pipe(take(1))
                        .subscribe({
                            complete: doneFn,
                            error: doneFn.fail,
                            next: (val: any): void => {
                                expect(val).toEqual(initialTripData);
                                doneFn();
                            },
                        });
                });
            });
            describe('statusObservable ', (): void => {
                it('should set statusObservable to value from createStatusObservable()', (doneFn: DoneFn): void => {
                    const service: TripPassagesService = new TripPassagesService(testRoute, undefined, undefined);
                    service.statusObservable
                        .pipe(take(1))
                        .subscribe({
                            complete: doneFn,
                            error: doneFn.fail,
                            next: (val: any): void => {
                                expect(val).toEqual(initialTripData);
                                doneFn();
                            },
                        });
                    refreshSubject.next(initialTripData);
                });
            });
        });
        describe('createDelayedPassageRequest', (): void => {
            const networkResult: any = {
                network: true,
                result: 1,
            };
            const getTripPassagesSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('getTripPassages');
            let testService: TripPassagesService;
            let convertResponseSpy: jasmine.Spy<jasmine.Func>;
            let handleErrorSpy: jasmine.Spy<jasmine.Func>;
            let createStatusObservableSpy: jasmine.Spy<jasmine.Func>;
            beforeAll((): void => {
                createStatusObservableSpy = spyOn(TripPassagesService.prototype, 'createStatusObservable');
                convertResponseSpy = spyOn(TripPassagesUtil, 'convertResponse');
                handleErrorSpy = spyOn(TripPassagesUtil, 'handleError');
                createStatusObservableSpy.and.callFake((): void => { });
                const testRoute: any = {
                    snapshot: { data: initialRouteData },
                };
                const testApiService: any = {
                    getTripPassages: getTripPassagesSpy,
                };
                testService = new TripPassagesService(testRoute, testApiService, undefined);
            });
            afterEach((): void => {
                getTripPassagesSpy.calls.reset();
                handleErrorSpy.calls.reset();
                convertResponseSpy.calls.reset();
                createStatusObservableSpy.calls.reset();
            });
            [2, 5, 20].forEach((testDelay: number): void => {
                it('should call getTripPassages after ' + testDelay + ' seconds', fakeAsync((): void => {
                    const testTripId: string = 'any test id';
                    convertResponseSpy.and.returnValue(map((a: any): any => Object.assign({ c: 2 }, a)));
                    handleErrorSpy.and.returnValue(map((a: any): any => Object.assign({ d: 3 }, a)));
                    getTripPassagesSpy.and.returnValue(of(networkResult));
                    const nextSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('nextSpy');
                    const subscription: Subscription = testService
                        .createDelayedPassageRequest(testTripId, testDelay * 1000)
                        .subscribe(nextSpy);
                    expect(convertResponseSpy).toHaveBeenCalledTimes(1);
                    expect(convertResponseSpy).toHaveBeenCalledWith(testTripId);
                    expect(handleErrorSpy).toHaveBeenCalledTimes(1);
                    expect(handleErrorSpy).toHaveBeenCalledWith(testTripId);
                    tick((testDelay * 1000) - 500);
                    expect(subscription.closed).toBeFalse();
                    expect(nextSpy).toHaveBeenCalledTimes(0);
                    tick(1000);
                    expect(subscription.closed).toBeTrue();
                    expect(nextSpy).toHaveBeenCalledTimes(1);
                    expect(nextSpy).toHaveBeenCalledWith({ d: 3, c: 2, network: true, result: 1 });
                    subscription.unsubscribe();
                }));
            });
        });
        describe('createStatusObservable()', (): void => {
            let testService: TripPassagesService;
            let createRefreshPollObservableSpy: jasmine.Spy<jasmine.Func>;
            let createStatusObservableSpy: jasmine.Spy<jasmine.Func>;
            let routeDataSubject: Subject<any> = new Subject();
            let statusSubject: Subject<IPassageStatus> = new Subject();
            let statusSubjectNextSpy: jasmine.Spy<jasmine.Func>;
            beforeEach((): void => {
                routeDataSubject = new Subject();
                statusSubject = new Subject();
                statusSubjectNextSpy = spyOn(statusSubject, 'next').and.callThrough();
                createStatusObservableSpy = spyOn(TripPassagesService.prototype, 'createStatusObservable');
                createStatusObservableSpy.and.callFake((): void => { });
                const testRoute: any = {
                    data: routeDataSubject,
                    snapshot: { data: initialRouteData },
                };
                testService = new TripPassagesService(testRoute, undefined, undefined);
                createStatusObservableSpy.and.callThrough();
                createRefreshPollObservableSpy = spyOn(testService, 'createRefreshPollObservable');
            });
            afterEach((): void => {
                createRefreshPollObservableSpy.calls.reset();
                createStatusObservableSpy.calls.reset();
                statusSubjectNextSpy.calls.reset();
            });
            it('should only pass on routeData', (doneFn: DoneFn): void => {
                const testValue: IPassageStatus = {
                    failures: 0,
                    status: UpdateStatus.ERROR,
                    timestamp: 292992,
                    tripId: 'tripId',
                    tripInfo: undefined,
                };
                createRefreshPollObservableSpy.and
                    .callFake((): Observable<any> => EMPTY);
                testService.createStatusObservable(statusSubject)
                    .pipe(toArray())
                    .subscribe({
                        complete: doneFn,
                        error: doneFn.fail,
                        next: (val: IPassageStatus[]): void => {
                            expect(createRefreshPollObservableSpy).toHaveBeenCalledTimes(1);
                            expect(createRefreshPollObservableSpy).toHaveBeenCalledWith(statusSubject);
                            expect(val).toEqual([testValue]);
                            expect(statusSubjectNextSpy).toHaveBeenCalledTimes(1);
                        },
                    });
                routeDataSubject.next({ tripPassages: testValue });
                statusSubject.complete();
                routeDataSubject.complete();
            });
            it('should only pass on statusData', (doneFn: DoneFn): void => {
                const testValue: IPassageStatus = {
                    failures: 0,
                    status: UpdateStatus.ERROR,
                    timestamp: 292992,
                    tripId: 'tripId',
                    tripInfo: undefined,
                };
                createRefreshPollObservableSpy.and
                    .callFake((inp: Observable<any>): Observable<any> => inp.pipe(take(1)));
                testService.createStatusObservable(statusSubject)
                    .pipe(toArray())
                    .subscribe({
                        complete: doneFn,
                        error: doneFn.fail,
                        next: (val: IPassageStatus[]): void => {
                            expect(createRefreshPollObservableSpy).toHaveBeenCalledTimes(1);
                            expect(createRefreshPollObservableSpy).toHaveBeenCalledWith(statusSubject);
                            expect(val).toEqual([testValue]);
                            expect(statusSubjectNextSpy).toHaveBeenCalledTimes(2);
                        },
                    });
                statusSubject.next(testValue);
                statusSubject.complete();
                routeDataSubject.complete();
            });
            it('should pass on both data sources', (doneFn: DoneFn): void => {
                const testValue: IPassageStatus = {
                    failures: 0,
                    status: UpdateStatus.ERROR,
                    timestamp: 292992,
                    tripId: 'tripId',
                    tripInfo: undefined,
                };
                const testValue2: IPassageStatus = {
                    failures: 0,
                    status: UpdateStatus.ERROR,
                    timestamp: 29232,
                    tripId: 'tripId',
                    tripInfo: undefined,
                };
                createRefreshPollObservableSpy.and
                    .callFake((inp: Observable<any>): Observable<any> => inp.pipe(skip(1), take(1)));
                testService.createStatusObservable(statusSubject)
                    .pipe(toArray())
                    .subscribe({
                        complete: doneFn,
                        error: doneFn.fail,
                        next: (val: IPassageStatus[]): void => {
                            expect(createRefreshPollObservableSpy).toHaveBeenCalledTimes(1);
                            expect(createRefreshPollObservableSpy).toHaveBeenCalledWith(statusSubject);
                            expect(val).toEqual([testValue, testValue2]);
                            expect(statusSubjectNextSpy).toHaveBeenCalledTimes(3);
                            expect(statusSubjectNextSpy.calls.allArgs()).toEqual([
                                [testValue],
                                [testValue2],
                                [testValue2]]);
                        },
                    });
                routeDataSubject.next({ tripPassages: testValue });
                statusSubject.next(testValue2);
                statusSubject.complete();
                routeDataSubject.complete();
            });
            it('should should accumulate failure numbers from both sources', (doneFn: DoneFn): void => {
                const testValue: IPassageStatus = {
                    failures: 1,
                    status: UpdateStatus.ERROR,
                    timestamp: 292992,
                    tripId: 'tripId',
                    tripInfo: undefined,
                };
                const testValue2: IPassageStatus = {
                    failures: 3,
                    status: UpdateStatus.ERROR,
                    timestamp: 29232,
                    tripId: 'tripId',
                    tripInfo: undefined,
                };
                createRefreshPollObservableSpy.and
                    .callFake((inp: Observable<any>): Observable<any> => inp.pipe(skip(1), take(1)));
                testService.createStatusObservable(statusSubject)
                    .pipe(toArray())
                    .subscribe({
                        complete: doneFn,
                        error: doneFn.fail,
                        next: (val: IPassageStatus[]): void => {
                            expect(createRefreshPollObservableSpy).toHaveBeenCalledTimes(1);
                            expect(createRefreshPollObservableSpy).toHaveBeenCalledWith(statusSubject);
                            expect(val).toEqual([testValue, {
                                failures: 4,
                                status: UpdateStatus.ERROR,
                                timestamp: 29232,
                                tripId: 'tripId',
                                tripInfo: undefined,
                            }]);
                            expect(statusSubjectNextSpy).toHaveBeenCalledTimes(3);
                            expect(statusSubjectNextSpy.calls.allArgs()).toEqual([
                                [testValue],
                                [testValue2],
                                [{
                                    failures: 4,
                                    status: UpdateStatus.ERROR,
                                    timestamp: 29232,
                                    tripId: 'tripId',
                                    tripInfo: undefined,
                                }]]);
                        },
                    });
                routeDataSubject.next({ tripPassages: testValue });
                statusSubject.next(testValue2);
                statusSubject.complete();
                routeDataSubject.complete();
            });
        });
        describe('createRefreshPollObservable()', (): void => {
            let testObservable: Observable<IPassageStatus>;
            const statusSubject: Subject<PartialPassageStatus> = new Subject();
            let createStatusObservableSpy: jasmine.Spy<jasmine.Func>;
            let testService: TripPassagesService;
            let createDelayedPassageRequestSpy: jasmine.Spy<jasmine.Func>;
            beforeAll((): void => {
                createStatusObservableSpy = spyOn(TripPassagesService.prototype, 'createStatusObservable');
                createStatusObservableSpy.and.returnValue(NEVER);
                const testRoute: any = {
                    snapshot: { data: initialRouteData },
                };
                const testApiService: any = {
                };
                testService = new TripPassagesService(testRoute, testApiService, undefined);
                createDelayedPassageRequestSpy = spyOn(testService, 'createDelayedPassageRequest');
            });
            beforeEach((): void => {
                testObservable = testService.createRefreshPollObservable(statusSubject as Subject<IPassageStatus>);
            });
            afterEach((): void => {
                createStatusObservableSpy.calls.reset();
            });
            it('should delay querying 10s if previous status is LOADED', fakeAsync((): void => {
                const nextSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('nextSpy');
                createDelayedPassageRequestSpy.and.callFake((): Observable<any> =>
                    of(createDelayedPassageRequestSpy.calls.count()).pipe(delay(1000)));
                const subscription: Subscription = testObservable.subscribe(nextSpy);
                expect(createDelayedPassageRequestSpy).toHaveBeenCalledTimes(0);
                statusSubject.next({
                    status: UpdateStatus.LOADED,
                    tripId: '1',
                });
                expect(createDelayedPassageRequestSpy).toHaveBeenCalledTimes(1);
                expect(nextSpy).toHaveBeenCalledTimes(0);
                tick(1100);
                expect(nextSpy).toHaveBeenCalledTimes(1);
                statusSubject.next({
                    status: UpdateStatus.LOADED,
                    tripId: '2',
                });
                expect(createDelayedPassageRequestSpy).toHaveBeenCalledTimes(2);
                tick(500);
                expect(nextSpy).toHaveBeenCalledTimes(1);
                statusSubject.next({
                    status: UpdateStatus.ERROR,
                    tripId: '3',
                });
                expect(createDelayedPassageRequestSpy).toHaveBeenCalledTimes(3);
                expect(nextSpy).toHaveBeenCalledTimes(1);
                expect(nextSpy.calls.allArgs()).toEqual([[1]]);
                tick(1100);
                expect(nextSpy).toHaveBeenCalledTimes(2);
                expect(nextSpy.calls.allArgs()).toEqual([[1], [3]]);
                expect(createDelayedPassageRequestSpy.calls.allArgs())
                    .toEqual([['1', 10000], ['2', 10000], ['3', 20000]]);
                subscription.unsubscribe();
            }));
        });
    });
});
