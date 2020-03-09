import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { from, throwError, Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { TripPassagesResolver } from './trip-passages.resolver';
// import * as sinon from "sinon";
describe('src/app/modules/stop/trip-passages.resolver', () => {
    describe('TripPassagesResolver', () => {
        let resolver: TripPassagesResolver;
        let getSpy: jasmine.Spy<jasmine.Func>;
        let navigateSpy: jasmine.Spy<jasmine.Func>;
        let nextSpy: jasmine.Spy<jasmine.Func>;
        const testId = '239jmcntest';
        beforeAll(() => {
            getSpy = jasmine.createSpy();
            navigateSpy = jasmine.createSpy();
            nextSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [TripPassagesResolver,
                    {
                        provide: ApiService,
                        useValue: {
                            getTripPassages: getSpy,
                        },
                    }, {
                        provide: Router,
                        useValue: {
                            navigate: navigateSpy,
                        },
                    }],
            });
            resolver = TestBed.get(TripPassagesResolver);
        }));

        afterEach(() => {
            getSpy.calls.reset();
            nextSpy.calls.reset();
            navigateSpy.calls.reset();
        });

        describe('resolve(route, state)', () => {
            describe('should succeed', () => {
                beforeEach(() => {
                    getSpy.and.callFake((...args: any[]): Observable<any> =>
                        from([args]));
                });
                it('should construct the request correctly', (done) => {
                    resolver.resolve({ params: { tripId: testId } } as any, undefined).subscribe(nextSpy, done, done);
                });
                afterEach(() => {
                    expect(nextSpy.calls.count()).toEqual(1);
                    expect(nextSpy.calls.first().args[0] as any)
                        .toEqual([testId]);
                    expect(navigateSpy.calls.count()).toEqual(0);
                });
            });
            describe('should not navigate for generic error', () => {
                const testError: Error = new Error('test error');
                beforeEach(() => {
                    getSpy.and.callFake((...args: any[]): Observable<any> =>
                        throwError(testError));
                });
                it('should construct the request correctly', (done) => {
                    resolver.resolve({ params: { tripId: testId } } as any, undefined).subscribe(nextSpy, done, done);
                });
                afterEach(() => {
                    expect(nextSpy.calls.count()).toEqual(0);
                    expect(navigateSpy.calls.count()).toEqual(0);
                });
            });
            describe('should navigate for 404 error', () => {
                const testError: any = {
                    status: 404,
                };
                beforeEach(() => {
                    getSpy.and.callFake((...args: any[]): Observable<any> =>
                        throwError(testError));
                });
                it('should construct the request correctly', (done) => {
                    resolver.resolve({ params: { tripId: testId } } as any, undefined).subscribe(nextSpy, done, done);
                });
                afterEach(() => {
                    expect(nextSpy.calls.count()).toEqual(0);
                    expect(navigateSpy.calls.count()).toEqual(1);
                });
            });
        });
    });
});
