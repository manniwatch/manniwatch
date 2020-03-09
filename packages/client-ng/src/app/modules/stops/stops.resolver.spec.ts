/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpErrorResponse } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { from, throwError } from 'rxjs';
import { ApiService } from 'src/app/services';
import { StopsResolver } from './stops.resolver';

// import * as sinon from "sinon";
describe('src/app/modules/stops/stops.resolver', () => {
    describe('StopsResolver', () => {
        let resolver: StopsResolver;
        let getSpy: jasmine.Spy<jasmine.Func>;
        let navigateSpy: jasmine.Spy<jasmine.Func>;
        let nextSpy: jasmine.Spy<jasmine.Func>;
        let errorSpy: jasmine.Spy<jasmine.Func>;
        let openDialogSpy: jasmine.Spy<jasmine.Func>;
        beforeAll(() => {
            getSpy = jasmine.createSpy();
            navigateSpy = jasmine.createSpy();
            nextSpy = jasmine.createSpy();
            errorSpy = jasmine.createSpy();
            openDialogSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [StopsResolver,
                    {
                        provide: ApiService,
                        useValue: {
                            getStations: getSpy,
                        },
                    }, {
                        provide: Router,
                        useValue: {
                            navigate: navigateSpy,
                        },
                    }, {
                        provide: MatDialog,
                        useValue: {
                            open: openDialogSpy,
                        },
                    }],
            });
            resolver = TestBed.get(StopsResolver);
        }));

        afterEach(() => {
            getSpy.calls.reset();
            nextSpy.calls.reset();
            navigateSpy.calls.reset();
            errorSpy.calls.reset();
            openDialogSpy.calls.reset();
        });

        describe('resolve(route, state)', () => {
            describe('a 404 error occurs', () => {
                const testError: HttpErrorResponse = new HttpErrorResponse({ status: 404 });
                beforeEach(() => {
                    getSpy.and.returnValue(throwError(testError));
                });
                it('should redirect to the 404 page', (done) => {
                    resolver.resolve(undefined, undefined)
                        .subscribe(nextSpy, errorSpy, () => {
                            expect(nextSpy).toHaveBeenCalledTimes(0);
                            expect(errorSpy).toHaveBeenCalledTimes(0);
                            expect(openDialogSpy).toHaveBeenCalledTimes(0);
                            expect(navigateSpy).toHaveBeenCalledTimes(1);
                            expect(navigateSpy).toHaveBeenCalledWith(['error', 'not-found']);
                            done();
                        });
                });
            });
            describe('no error occurs', () => {
                const testValues: number[] = [1, 2, 3];
                beforeEach(() => {
                    getSpy.and.returnValue(from(testValues));
                });
                it('should redirect to the 404 page', (done) => {
                    resolver.resolve(undefined, undefined)
                        .subscribe(nextSpy, errorSpy, () => {
                            expect(nextSpy).toHaveBeenCalledTimes(3);
                            expect(nextSpy.calls.allArgs()).toEqual(testValues.map((value) => [value]));
                            expect(errorSpy).toHaveBeenCalledTimes(0);
                            expect(openDialogSpy).toHaveBeenCalledTimes(0);
                            expect(navigateSpy).toHaveBeenCalledTimes(0);
                            done();
                        });
                });
            });
            describe('retry dialog gets triggered', () => {
                describe('retry dialog gets dismissed', () => {
                    const testError: Error = new Error('Test Error');
                    beforeEach(() => {
                        getSpy.and.returnValue(throwError(testError));
                        openDialogSpy.and.returnValue({
                            afterClosed: () =>
                                from([false]),
                        });
                    });
                    afterEach(() => {

                    });
                    it('should redirect to the 404 page', (done) => {
                        resolver.resolve(undefined, undefined)
                            .subscribe(nextSpy, () => {
                                expect(nextSpy).toHaveBeenCalledTimes(0);
                                expect(errorSpy).toHaveBeenCalledTimes(0);
                                expect(openDialogSpy).toHaveBeenCalledTimes(1);
                                // expect(openDialogSpy).toHaveBeenCalledTimes(1);
                                expect(navigateSpy).toHaveBeenCalledTimes(0);
                                done();
                            });
                    });
                });
                describe('retry dialog gets opened', () => {
                    describe('for an error with status property', () => {
                        const testError: HttpErrorResponse = new HttpErrorResponse({ status: 505 });
                        beforeEach(() => {
                            getSpy.and.returnValue(throwError(testError));
                            openDialogSpy.and.returnValue({
                                afterClosed: () =>
                                    openDialogSpy.calls.count() < 2 ? from([true]) : from([false]),
                            });
                        });
                        afterEach(() => {

                        });
                        it('should redirect to the 404 page', (done) => {
                            resolver.resolve(undefined, undefined)
                                .subscribe(nextSpy, () => {
                                    expect(nextSpy).toHaveBeenCalledTimes(0);
                                    expect(errorSpy).toHaveBeenCalledTimes(0);
                                    expect(openDialogSpy).toHaveBeenCalledTimes(2);
                                    // expect(openDialogSpy).toHaveBeenCalledTimes(1);
                                    expect(navigateSpy).toHaveBeenCalledTimes(0);
                                    done();
                                });
                        });
                    });
                    describe('for an error without status property', () => {
                        const testError: Error = new Error('Test Error');
                        beforeEach(() => {
                            getSpy.and.returnValue(throwError(testError));
                            openDialogSpy.and.returnValue({
                                afterClosed: () =>
                                    openDialogSpy.calls.count() < 2 ? from([true]) : from([false]),
                            });
                        });
                        afterEach(() => {

                        });
                        it('should redirect to the 404 page', (done) => {
                            resolver.resolve(undefined, undefined)
                                .subscribe(nextSpy, () => {
                                    expect(nextSpy).toHaveBeenCalledTimes(0);
                                    expect(errorSpy).toHaveBeenCalledTimes(0);
                                    expect(openDialogSpy).toHaveBeenCalledTimes(2);
                                    // expect(openDialogSpy).toHaveBeenCalledTimes(1);
                                    expect(navigateSpy).toHaveBeenCalledTimes(0);
                                    done();
                                });
                        });
                    });
                });
            });
        });
    });
});
