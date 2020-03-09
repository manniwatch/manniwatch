import { from, merge, throwError, Subject } from 'rxjs';
import { delay, flatMap, retryWhen, tap } from 'rxjs/operators';
import { retryDialogStrategy, RetryDialogStrategyFuncResponse } from './retry-dialog-strategy';

describe('src/app/rxjs-util/retry-dialog-strategy.ts', () => {
    describe('retryDialogStrategy', () => {
        let createDialogSpy: jasmine.Spy<jasmine.Func>;
        let strategy: RetryDialogStrategyFuncResponse;
        let nextSpy: jasmine.Spy<jasmine.Func>;
        let errorSpy: jasmine.Spy<jasmine.Func>;
        beforeAll(() => {
            createDialogSpy = jasmine.createSpy();
            nextSpy = jasmine.createSpy('nextSpy');
            errorSpy = jasmine.createSpy('errorSpy');
        });
        beforeEach(() => {
            strategy = retryDialogStrategy(createDialogSpy);
        });
        afterEach(() => {
            createDialogSpy.calls.reset();
            nextSpy.calls.reset();
            errorSpy.calls.reset();
        });
        describe('No error occures', () => {
            it('should pass', (done) => {
                from([1, 2, 3])
                    .pipe(retryWhen(strategy))
                    .subscribe(nextSpy, errorSpy, () => {
                        expect(errorSpy).not.toHaveBeenCalled();
                        expect(nextSpy).toHaveBeenCalledTimes(3);
                        expect(nextSpy.calls.allArgs()).toEqual([[1], [2], [3]]); // , [2], [3]);
                        expect(createDialogSpy).not.toHaveBeenCalled();
                        done();
                    });
            });
            afterEach(() => {
                expect(createDialogSpy).not.toHaveBeenCalled();
            });
        });
        describe('Error occurs', () => {
            const testError: Error = new Error('testError');
            const afterClosedSubject: Subject<boolean> = new Subject();
            beforeEach(() => {
                createDialogSpy.and.callFake(() =>
                    ({
                        afterClosed: () => afterClosedSubject.pipe(delay(100)),
                    }));
            });
            describe('Should be retried', () => {
                it('should open the dialog and succeed after first retry', (done) => {
                    let tries = 0;
                    from([1])
                        .pipe(
                            tap((value) => {
                                tries++;
                                if (tries < 2) {
                                    throw testError;
                                }
                            }),
                            retryWhen(strategy))
                        .subscribe(nextSpy, errorSpy, () => {
                            expect(errorSpy).not.toHaveBeenCalled();
                            expect(nextSpy).toHaveBeenCalledTimes(1);
                            expect(nextSpy.calls.allArgs()).toEqual([[1]]);
                            expect(createDialogSpy).toHaveBeenCalledTimes(1);
                            done();
                        });
                    afterClosedSubject.next(true);
                });
                it('should not open dialogs twice', (done) => {
                    let tries = 0;
                    from([1])
                        .pipe(
                            flatMap((value) => {
                                tries++;
                                if (tries < 2) {
                                    return merge(throwError(testError), throwError(testError));
                                } else {
                                    return from([value]);
                                }
                            }),
                            retryWhen(strategy))
                        .subscribe(nextSpy, errorSpy, () => {
                            expect(errorSpy).not.toHaveBeenCalled();
                            expect(nextSpy).toHaveBeenCalledTimes(1);
                            expect(nextSpy.calls.allArgs()).toEqual([[1]]);
                            expect(createDialogSpy).toHaveBeenCalledTimes(1);
                            done();
                        });
                    afterClosedSubject.next(true);
                });
            });
            describe('Should not be retried', () => {
                it('should open the dialog and fail the observable', (done) => {
                    throwError(testError)
                        .pipe(retryWhen(strategy))
                        .subscribe(nextSpy, () => {
                            expect(nextSpy).not.toHaveBeenCalled();
                            expect(createDialogSpy).toHaveBeenCalledTimes(1);
                            done();
                        });
                    afterClosedSubject.next(false);
                });
                it('should open the dialog and retry once and fail the observable after', (done) => {
                    throwError(testError)
                        .pipe(retryWhen(strategy))
                        .subscribe(nextSpy, () => {
                            expect(errorSpy).not.toHaveBeenCalled();
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
