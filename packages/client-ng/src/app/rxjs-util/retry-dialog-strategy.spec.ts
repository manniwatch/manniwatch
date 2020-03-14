/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { from, merge, throwError, Observable, Subject } from 'rxjs';
import { delay, flatMap, retryWhen, tap } from 'rxjs/operators';
import { retryDialogStrategy, RetryDialogStrategyFuncResponse } from './retry-dialog-strategy';

describe('src/app/rxjs-util/retry-dialog-strategy.ts', (): void => {
    describe('retryDialogStrategy', (): void => {
        let createDialogSpy: jasmine.Spy<jasmine.Func>;
        let strategy: RetryDialogStrategyFuncResponse;
        let nextSpy: jasmine.Spy<jasmine.Func>;
        beforeAll((): void => {
            createDialogSpy = jasmine.createSpy();
            nextSpy = jasmine.createSpy('nextSpy');
        });
        beforeEach((): void => {
            strategy = retryDialogStrategy(createDialogSpy);
        });
        afterEach((): void => {
            createDialogSpy.calls.reset();
            nextSpy.calls.reset();
        });
        describe('No error occures', (): void => {
            it('should pass', (done: DoneFn): void => {
                from([1, 2, 3])
                    .pipe(retryWhen(strategy))
                    .subscribe(nextSpy, done.fail, (): void => {
                        expect(nextSpy).toHaveBeenCalledTimes(3);
                        expect(nextSpy.calls.allArgs()).toEqual([[1], [2], [3]]); // , [2], [3]);
                        expect(createDialogSpy).not.toHaveBeenCalled();
                        done();
                    });
            });
            afterEach((): void => {
                expect(createDialogSpy).not.toHaveBeenCalled();
            });
        });
        describe('Error occurs', (): void => {
            const testError: Error = new Error('testError');
            const afterClosedSubject: Subject<boolean> = new Subject();
            beforeEach((): void => {
                createDialogSpy.and.callFake((): any =>
                    ({
                        afterClosed: (): Observable<any> => afterClosedSubject.pipe(delay(100)),
                    }));
            });
            describe('Should be retried', (): void => {
                it('should open the dialog and succeed after first retry', (done: DoneFn): void => {
                    let tries: number = 0;
                    from([1])
                        .pipe(
                            tap((value: number): void => {
                                tries++;
                                if (tries < 2) {
                                    throw testError;
                                }
                            }),
                            retryWhen(strategy))
                        .subscribe(nextSpy, done.fail, (): void => {
                            expect(nextSpy).toHaveBeenCalledTimes(1);
                            expect(nextSpy.calls.allArgs()).toEqual([[1]]);
                            expect(createDialogSpy).toHaveBeenCalledTimes(1);
                            done();
                        });
                    afterClosedSubject.next(true);
                });
                it('should not open dialogs twice', (done: DoneFn): void => {
                    let tries: number = 0;
                    from([1])
                        .pipe(
                            flatMap((value: number): Observable<any> => {
                                tries++;
                                if (tries < 2) {
                                    return merge(throwError(testError), throwError(testError));
                                } else {
                                    return from([value]);
                                }
                            }),
                            retryWhen(strategy))
                        .subscribe(nextSpy, done.fail, (): void => {
                            expect(nextSpy).toHaveBeenCalledTimes(1);
                            expect(nextSpy.calls.allArgs()).toEqual([[1]]);
                            expect(createDialogSpy).toHaveBeenCalledTimes(1);
                            done();
                        });
                    afterClosedSubject.next(true);
                });
            });
            describe('Should not be retried', (): void => {
                it('should open the dialog and fail the observable', (done: DoneFn): void => {
                    throwError(testError)
                        .pipe(retryWhen(strategy))
                        .subscribe(nextSpy, (): void => {
                            expect(nextSpy).not.toHaveBeenCalled();
                            expect(createDialogSpy).toHaveBeenCalledTimes(1);
                            done();
                        });
                    afterClosedSubject.next(false);
                });
                it('should open the dialog and retry once and fail the observable after', (done: DoneFn): void => {
                    throwError(testError)
                        .pipe(retryWhen(strategy))
                        .subscribe(nextSpy, (): void => {
                            expect(nextSpy).not.toHaveBeenCalled();
                            expect(createDialogSpy).toHaveBeenCalledTimes(2);
                            done();
                        });
                    afterClosedSubject.next(true);
                    afterClosedSubject.next(false);
                });
            });
        });
    });
});
