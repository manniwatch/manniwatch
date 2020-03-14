/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppErrorHandler } from './app-error-handler';
import { AppNotificationService, AppNotificationType } from './services/app-notification.service';

describe('src/app/app-error-handler.ts', (): void => {
    describe('AppErrorHandler', (): void => {
        let handler: AppErrorHandler;
        const notifySpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('notifySpy');
        let isClientOfflineSpy: jasmine.Spy<jasmine.Func>;
        let notificationService: AppNotificationService;
        beforeEach((): void => {
            TestBed.configureTestingModule({
                providers: [{
                    provide: AppNotificationService,
                    useValue: {
                        notify: notifySpy,
                    },
                }, {
                    provide: ErrorHandler,
                    useClass: AppErrorHandler,
                }],
            });
            handler = TestBed.inject(ErrorHandler) as AppErrorHandler;
            notificationService = TestBed.inject(AppNotificationService);
            isClientOfflineSpy = spyOn(handler, 'isClientOffline');
        });
        afterEach((): void => {
            isClientOfflineSpy.calls.reset();
            notifySpy.calls.reset();
        });
        it('should be constructed', (): void => {
            expect(handler).toBeTruthy();
        });
        describe('handleError()', (): void => {
            let handleHttpErrorResponseSpy: jasmine.Spy<jasmine.Func>;
            let consoleErrorSpy: jasmine.Spy<jasmine.Func>;
            beforeAll((): void => {
                consoleErrorSpy = spyOn(console, 'error');
            });
            beforeEach((): void => {
                consoleErrorSpy.and.callFake((): void => { });
                handleHttpErrorResponseSpy = spyOn(handler, 'handleHttpErrorResponse');
                handleHttpErrorResponseSpy.and.callFake((): boolean =>
                    false);
            });
            afterEach((): void => {
                handleHttpErrorResponseSpy.calls.reset();
                consoleErrorSpy.calls.reset();
            });
            describe('an HttpErrorResponse is reported', (): void => {
                [new HttpErrorResponse({
                    status: 200,
                    statusText: '500 error message',
                })].forEach((testError: any): void => {
                    it('should call handleHttpErrorResponse()', (): void => {
                        handler.handleError(testError);
                        expect(handleHttpErrorResponseSpy).toHaveBeenCalledTimes(1);
                        expect(handleHttpErrorResponseSpy).toHaveBeenCalledWith(testError, notificationService);
                        expect(notifySpy).toHaveBeenCalledTimes(0);
                        expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
                    });
                });
            });
            describe('an Error is reported', (): void => {
                [new Error('test error'),
                ].forEach((testError: any): void => {
                    it('should call notify()', (): void => {
                        handler.handleError(testError);
                        expect(handleHttpErrorResponseSpy).toHaveBeenCalledTimes(0);
                        expect(notifySpy).toHaveBeenCalledTimes(1);
                        expect(notifySpy).toHaveBeenCalledWith({
                            message: testError.message,
                            reportable: true,
                            title: 'Uncaught error occured',
                            type: AppNotificationType.ERROR,
                        });
                        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
                        expect(consoleErrorSpy).toHaveBeenCalledWith('It happens: ', testError);
                    });
                });
            });
        });
        describe('handleHttpErrorResponse(err,notificationService)', (): void => {
            const createError: (code: number) => HttpErrorResponse = (code: number): HttpErrorResponse =>
                new HttpErrorResponse({
                    status: code,
                    statusText: 'Status ' + code,
                    url: 'http://test.com/' + code,
                });
            interface ITestHttpError {
                error: HttpErrorResponse;
                message: {
                    type?: AppNotificationType;
                    title: string;
                    message?: string;
                    reportable?: boolean;
                };
            }
            const testHttpErrors: ITestHttpError[] = [{
                error: createError(404),
                message: {
                    message: `404 - ${createError(404).message}`,
                    title: 'Request-Error',
                    type: AppNotificationType.ERROR,
                },
            }, {
                error: createError(520),
                message: {
                    message: `520 - ${createError(520).message}`,
                    title: 'Server-Error',
                    type: AppNotificationType.ERROR,
                },
            }, {
                error: createError(350),
                message: {
                    title: 'Unknown HTTP-Error occured',
                    type: AppNotificationType.ERROR,
                },
            }];
            describe('client is offline', (): void => {
                beforeEach((): void => {
                    isClientOfflineSpy.and.returnValue(true);
                });
                testHttpErrors.forEach((testError: ITestHttpError): void => {
                    it('should notify that the client is offline for status: ' + testError.error.status, (): void => {
                        handler.handleHttpErrorResponse(testError.error, notificationService);
                        expect(isClientOfflineSpy).toHaveBeenCalledTimes(1);
                        expect(notifySpy).toHaveBeenCalledTimes(1);
                        expect(notifySpy).toHaveBeenCalledWith({
                            title: 'No Internet Connection',
                            type: AppNotificationType.ERROR,
                        });
                    });
                });
            });
            describe('client is online', (): void => {
                beforeEach((): void => {
                    isClientOfflineSpy.and.callFake((): boolean => false);
                });
                testHttpErrors.forEach((testError: ITestHttpError): void => {
                    it('should propagate a server error for code: ' + testError.error.status, (): void => {
                        handler.handleHttpErrorResponse(testError.error, notificationService);
                        expect(isClientOfflineSpy).toHaveBeenCalledTimes(1);
                        expect(notifySpy).toHaveBeenCalledTimes(1);
                        expect(notifySpy).toHaveBeenCalledWith(testError.message);
                    });
                });
            });
        });
    });
});
