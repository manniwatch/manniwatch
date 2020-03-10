import { async, TestBed } from '@angular/core/testing';
import { TripId } from '@donmahallem/trapeze-api-types';
import { of, throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from 'src/app/services';
import { TripPassagesResolver } from './trip-passages.resolver';
import { TripPassagesUtil } from './trip-util';

describe('src/app/modules/trip-passages/trip-passages.resolver', () => {
    describe('TripPassagesResolver', () => {
        let resolver: TripPassagesResolver;
        const testId: TripId = '239jmcntest' as TripId;
        let convertResponseStub: jasmine.Spy<jasmine.Func>;
        let handleErrorStub: jasmine.Spy<jasmine.Func>;
        let convertResponseOperatorStub: jasmine.Spy<jasmine.Func>;
        let handleErrorOperatorStub: jasmine.Spy<jasmine.Func>;
        let getTripPassagesSpy: jasmine.Spy<jasmine.Func>;
        let nextSpy: jasmine.Spy<jasmine.Func>;
        beforeAll(() => {
            convertResponseStub = spyOn(TripPassagesUtil, 'convertResponse');
            handleErrorStub = spyOn(TripPassagesUtil, 'handleError');
            convertResponseOperatorStub = jasmine.createSpy('convertResponseOperator');
            handleErrorOperatorStub = jasmine.createSpy('handleErrorOperator');
            getTripPassagesSpy = jasmine.createSpy('getTripPassages');
            nextSpy = jasmine.createSpy('onNext');
        });
        beforeEach(async(() => {
            convertResponseStub.and.callFake(() => convertResponseOperatorStub);
            handleErrorStub.and.callFake(() => handleErrorOperatorStub);
            TestBed.configureTestingModule({
                providers: [TripPassagesResolver,
                    {
                        provide: ApiService,
                        useValue: {
                            getTripPassages: getTripPassagesSpy,
                        },
                    }],
            });
            resolver = TestBed.get(TripPassagesResolver);
        }));

        afterEach(() => {
            convertResponseStub.calls.reset();
            handleErrorStub.calls.reset();
            getTripPassagesSpy.calls.reset();
            convertResponseOperatorStub.calls.reset();
            handleErrorOperatorStub.calls.reset();
            nextSpy.calls.reset();
        });

        describe('resolve(route, state)', () => {
            const convertedResponse: any = {
                converted: true,
                type: 'response',
            };
            const errorResponse: any = {
                converted: false,
                type: 'error',
            };

            afterEach(() => {
                expect(convertResponseStub).toHaveBeenCalledTimes(1);
                expect(handleErrorStub).toHaveBeenCalledTimes(1);
            });
            describe('getTripPassages() resolves', () => {
                beforeEach(() => {
                    getTripPassagesSpy.and.callFake((...args: any[]): Observable<any> =>
                        of(args));
                    handleErrorOperatorStub.and.callFake(catchError(() => of(errorResponse)));
                    convertResponseOperatorStub.and.callFake(map(() => convertedResponse));
                });
                it('should construct the request correctly', (done: DoneFn) => {
                    resolver.resolve({ params: { tripId: testId } } as any, undefined)
                        .subscribe({
                            complete: (): void => {
                                expect(getTripPassagesSpy)
                                    .toHaveBeenCalledTimes(1);
                                expect(getTripPassagesSpy.calls.argsFor(0))
                                    .toEqual([testId], 'getTripPassages should be called with the provided tripId');
                                expect(nextSpy)
                                    .toHaveBeenCalledTimes(1);
                                expect(nextSpy.calls.first().args[0]).toEqual(convertedResponse);
                                expect(convertResponseOperatorStub).toHaveBeenCalledTimes(1);
                                expect(handleErrorOperatorStub).toHaveBeenCalledTimes(1);
                                expect(convertResponseOperatorStub).toHaveBeenCalledBefore(handleErrorOperatorStub);
                                done();
                            },
                            error: done.fail,
                            next: nextSpy,
                        });
                });
            });
            describe('getTripPassages() rejects', () => {
                beforeEach(() => {
                    getTripPassagesSpy.and.callFake((...args: any[]): Observable<any> =>
                        throwError(args));
                    handleErrorOperatorStub.and.callFake(catchError(() => of(errorResponse)));
                    convertResponseOperatorStub.and.callFake(map(() => convertedResponse));
                });
                it('should construct the request correctly', (done: DoneFn) => {
                    resolver.resolve({ params: { tripId: testId } } as any, undefined)
                        .subscribe({
                            complete: (): void => {
                                expect(getTripPassagesSpy)
                                    .toHaveBeenCalledTimes(1);
                                expect(getTripPassagesSpy.calls.argsFor(0))
                                    .toEqual([testId], 'getTripPassages should be called with the provided tripId');
                                expect(nextSpy)
                                    .toHaveBeenCalledTimes(1);
                                expect(nextSpy.calls.first().args).toEqual([errorResponse]);
                                expect(convertResponseOperatorStub).toHaveBeenCalledTimes(1);
                                expect(handleErrorOperatorStub).toHaveBeenCalledTimes(1);
                                expect(convertResponseOperatorStub).toHaveBeenCalledBefore(handleErrorOperatorStub);
                                done();
                            },
                            error: done.fail,
                            next: nextSpy,
                        });
                });
            });
        });
    });
});
