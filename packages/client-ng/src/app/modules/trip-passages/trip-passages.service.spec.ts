import { fakeAsync, tick } from '@angular/core/testing';
import { TripId } from '@donmahallem/trapeze-api-types';
import { of, EMPTY, NEVER, Observable, Subject, Subscription } from 'rxjs';
import { delay, map, skip, take, toArray } from 'rxjs/operators';
import { TripPassagesService } from './trip-passages.service';
import { IPassageStatus, TripPassagesUtil, UpdateStatus } from './trip-util';

type PartialPassageStatus = Partial<IPassageStatus>;
describe('src/app/modules/trip-passages/trip-passages.service', () => {
    describe('TripPassagesService', () => {
        const initialTripData: any = {
            id: 'tripId1',
        };
        const initialRouteData: any = {
            tripPassages: initialTripData,
        };
        describe('constructor()', () => {
            const routeDataSubject: Subject<any> = new Subject();
            let createStatusObservableSpy: jasmine.Spy<jasmine.Func>;
            const refreshSubject: Subject<any> = new Subject();
            const testRoute: any = {
                data: routeDataSubject.asObservable(),
                snapshot: { data: initialRouteData },
            };
            beforeEach(() => {
                createStatusObservableSpy = spyOn(TripPassagesService.prototype, 'createStatusObservable');
                createStatusObservableSpy.and.returnValue(refreshSubject);
            });
            afterEach(() => {
                createStatusObservableSpy.calls.reset();
            });
            describe('statusSubject should be set by route data', () => {
                it('statusSubject should be initialized with route snapshot data', (doneFn: DoneFn) => {
                    const service: TripPassagesService = new TripPassagesService(testRoute, undefined);
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
            describe('statusObservable ', () => {
                it('should set statusObservable to value from createStatusObservable()', (doneFn: DoneFn) => {
                    const service: TripPassagesService = new TripPassagesService(testRoute, undefined);
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
        describe('createDelayedPassageRequest', () => {
            const networkResult: any = {
                network: true,
                result: 1,
            };
            const getTripPassagesSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('getTripPassages');
            let testService: TripPassagesService;
            let convertResponseSpy: jasmine.Spy<jasmine.Func>;
            let handleErrorSpy: jasmine.Spy<jasmine.Func>;
            let createStatusObservableSpy: jasmine.Spy<jasmine.Func>;
            beforeAll(() => {
                createStatusObservableSpy = spyOn(TripPassagesService.prototype, 'createStatusObservable');
                convertResponseSpy = spyOn(TripPassagesUtil, 'convertResponse');
                handleErrorSpy = spyOn(TripPassagesUtil, 'handleError');
                createStatusObservableSpy.and.callFake(() => { });
                const testRoute: any = {
                    snapshot: { data: initialRouteData },
                };
                const testApiService: any = {
                    getTripPassages: getTripPassagesSpy,
                };
                testService = new TripPassagesService(testRoute, testApiService);
            });
            afterEach(() => {
                getTripPassagesSpy.calls.reset();
                handleErrorSpy.calls.reset();
                convertResponseSpy.calls.reset();
                createStatusObservableSpy.calls.reset();
            });
            [2, 5, 20].forEach((testDelay: number): void => {
                it('should call getTripPassages after ' + testDelay + ' seconds', fakeAsync(() => {
                    const testTripId: TripId = 'any test id' as TripId;
                    convertResponseSpy.and.returnValue(map((a: any) => Object.assign({ c: 2 }, a)));
                    handleErrorSpy.and.returnValue(map((a: any) => Object.assign({ d: 3 }, a)));
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
        describe('createStatusObservable()', () => {
            let testService: TripPassagesService;
            let createRefreshPollObservableSpy: jasmine.Spy<jasmine.Func>;
            let createStatusObservableSpy: jasmine.Spy<jasmine.Func>;
            let routeDataSubject: Subject<any> = new Subject();
            let statusSubject: Subject<IPassageStatus> = new Subject();
            let statusSubjectNextSpy: jasmine.Spy<jasmine.Func>;
            beforeEach(() => {
                routeDataSubject = new Subject();
                statusSubject = new Subject();
                statusSubjectNextSpy = spyOn(statusSubject, 'next').and.callThrough();
                createStatusObservableSpy = spyOn(TripPassagesService.prototype, 'createStatusObservable');
                createStatusObservableSpy.and.callFake(() => { });
                const testRoute: any = {
                    data: routeDataSubject,
                    snapshot: { data: initialRouteData },
                };
                testService = new TripPassagesService(testRoute, undefined);
                createStatusObservableSpy.and.callThrough();
                createRefreshPollObservableSpy = spyOn(testService, 'createRefreshPollObservable');
            });
            afterEach(() => {
                createRefreshPollObservableSpy.calls.reset();
                createStatusObservableSpy.calls.reset();
                statusSubjectNextSpy.calls.reset();
            });
            it('should only pass on routeData', (doneFn: DoneFn) => {
                const testValue: IPassageStatus = {
                    failures: 0,
                    status: UpdateStatus.ERROR,
                    timestamp: 292992,
                    tripId: 'tripId' as TripId,
                    tripInfo: undefined,
                };
                createRefreshPollObservableSpy.and
                    .callFake(() => EMPTY);
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
            it('should only pass on statusData', (doneFn: DoneFn) => {
                const testValue: IPassageStatus = {
                    failures: 0,
                    status: UpdateStatus.ERROR,
                    timestamp: 292992,
                    tripId: 'tripId' as TripId,
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
            it('should pass on both data sources', (doneFn: DoneFn) => {
                const testValue: IPassageStatus = {
                    failures: 0,
                    status: UpdateStatus.ERROR,
                    timestamp: 292992,
                    tripId: 'tripId' as TripId,
                    tripInfo: undefined,
                };
                const testValue2: IPassageStatus = {
                    failures: 0,
                    status: UpdateStatus.ERROR,
                    timestamp: 29232,
                    tripId: 'tripId' as TripId,
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
            it('should should accumulate failure numbers from both sources', (doneFn: DoneFn) => {
                const testValue: IPassageStatus = {
                    failures: 1,
                    status: UpdateStatus.ERROR,
                    timestamp: 292992,
                    tripId: 'tripId' as TripId,
                    tripInfo: undefined,
                };
                const testValue2: IPassageStatus = {
                    failures: 3,
                    status: UpdateStatus.ERROR,
                    timestamp: 29232,
                    tripId: 'tripId' as TripId,
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
                                tripId: 'tripId' as TripId,
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
                                    tripId: 'tripId' as TripId,
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
        describe('createRefreshPollObservable()', () => {
            let testObservable: Observable<IPassageStatus>;
            const statusSubject: Subject<PartialPassageStatus> = new Subject();
            let createStatusObservableSpy: jasmine.Spy<jasmine.Func>;
            let testService: TripPassagesService;
            let createDelayedPassageRequestSpy: jasmine.Spy<jasmine.Func>;
            beforeAll(() => {
                createStatusObservableSpy = spyOn(TripPassagesService.prototype, 'createStatusObservable');
                createStatusObservableSpy.and.returnValue(NEVER);
                const testRoute: any = {
                    snapshot: { data: initialRouteData },
                };
                const testApiService: any = {
                };
                testService = new TripPassagesService(testRoute, testApiService);
                createDelayedPassageRequestSpy = spyOn(testService, 'createDelayedPassageRequest');
            });
            beforeEach(() => {
                testObservable = testService.createRefreshPollObservable(statusSubject as Subject<IPassageStatus>);
            });
            afterEach(() => {
                createStatusObservableSpy.calls.reset();
            });
            it('should delay querying 10s if previous status is LOADED', fakeAsync(() => {
                const nextSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('nextSpy');
                createDelayedPassageRequestSpy.and.callFake(() =>
                    of(createDelayedPassageRequestSpy.calls.count()).pipe(delay(1000)));
                const subscription: Subscription = testObservable.subscribe(nextSpy);
                expect(createDelayedPassageRequestSpy).toHaveBeenCalledTimes(0);
                statusSubject.next({
                    status: UpdateStatus.LOADED,
                    tripId: '1' as TripId,
                });
                expect(createDelayedPassageRequestSpy).toHaveBeenCalledTimes(1);
                expect(nextSpy).toHaveBeenCalledTimes(0);
                tick(1100);
                expect(nextSpy).toHaveBeenCalledTimes(1);
                statusSubject.next({
                    status: UpdateStatus.LOADED,
                    tripId: '2' as TripId,
                });
                expect(createDelayedPassageRequestSpy).toHaveBeenCalledTimes(2);
                tick(500);
                expect(nextSpy).toHaveBeenCalledTimes(1);
                statusSubject.next({
                    status: UpdateStatus.ERROR,
                    tripId: '3' as TripId,
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
