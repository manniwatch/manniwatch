/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppErrorHandler } from './app-error-handler';
import { AppNotificationService, AppNotificationType } from './services/app-notification.service';

describe('src/app/app-error-handler.ts', () => {
    describe('AppErrorHandler', () => {
        let handler: AppErrorHandler;
        const notifySpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('notifySpy');
        let isClientOfflineSpy: jasmine.Spy<jasmine.Func>;
        let notificationService: AppNotificationService;
        beforeEach(() => {
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
            handler = TestBed.get(ErrorHandler);
            notificationService = TestBed.get(AppNotificationService);
            isClientOfflineSpy = spyOn(handler, 'isClientOffline');
        });
        afterEach(() => {
            isClientOfflineSpy.calls.reset();
            notifySpy.calls.reset();
        });
        it('should be constructed', () => {
            expect(handler).toBeTruthy();
        });
        describe('handleError()', () => {
            let handleHttpErrorResponseSpy: jasmine.Spy<jasmine.Func>;
            beforeEach(() => {
                handleHttpErrorResponseSpy = spyOn(handler, 'handleHttpErrorResponse');
                handleHttpErrorResponseSpy.and.callFake(() =>
                    false);
            });
            afterEach(() => {
                handleHttpErrorResponseSpy.calls.reset();
            });
            describe('an HttpErrorResponse is reported', () => {
                [new HttpErrorResponse({
                    status: 200,
                    statusText: '500 error message',
                })].forEach((testError: any) => {
                    it('should call handleHttpErrorResponse()', () => {
                        handler.handleError(testError);
                        expect(handleHttpErrorResponseSpy).toHaveBeenCalledTimes(1);
                        expect(handleHttpErrorResponseSpy).toHaveBeenCalledWith(testError, notificationService);
                        expect(notifySpy).toHaveBeenCalledTimes(0);
                    });
                });
            });
            describe('an Error is reported', () => {
                [new Error('test error'),
                ].forEach((testError: any) => {
                    it('should call notify()', () => {
                        handler.handleError(testError);
                        expect(handleHttpErrorResponseSpy).toHaveBeenCalledTimes(0);
                        expect(notifySpy).toHaveBeenCalledTimes(1);
                        expect(notifySpy).toHaveBeenCalledWith({
                            message: testError.message,
                            reportable: true,
                            title: 'Uncaught error occured',
                            type: AppNotificationType.ERROR,
                        });
                    });
                });
            });
        });
        describe('handleHttpErrorResponse(err,notificationService)', () => {
            const createError = (code: number) =>
                new HttpErrorResponse({
                    status: code,
                    statusText: 'Status ' + code,
                    url: 'http://test.com/' + code,
                });
            const testHttpErrors: {
                error: HttpErrorResponse,
                message: {
                    type?: AppNotificationType;
                    title: string;
                    message?: string;
                    reportable?: boolean;
                },
            }[] = [{
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
            describe('client is offline', () => {
                beforeEach(() => {
                    isClientOfflineSpy.and.returnValue(true);
                });
                testHttpErrors.forEach((testError) => {
                    it('should notify that the client is offline for status: ' + testError.error.status, () => {
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
            describe('client is online', () => {
                beforeEach(() => {
                    isClientOfflineSpy.and.callFake(() => false);
                });
                testHttpErrors.forEach((testError) => {
                    it('should propagate a server error for code: ' + testError.error.status, () => {
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
