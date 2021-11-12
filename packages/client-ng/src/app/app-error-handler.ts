/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { AppNotificationService, AppNotificationType } from './services/app-notification.service';

/**
 * AppErrorHandler to catch global errors
 */
@Injectable()
export class AppErrorHandler implements ErrorHandler {

    public constructor(private injector: Injector) { }

    /**
     * If the browser supports the online tag it will
     * returns its value. otherwise it will always be true
     * @returns true if the navigator is offline
     */
    public isClientOffline(): boolean {
        return (!navigator.onLine);
    }

    /**
     * Handles all errors
     */
    public handleError(error: Error | HttpErrorResponse | any): void {
        // The notification service
        const notificationService: AppNotificationService = this.injector.get(AppNotificationService);
        if (error instanceof HttpErrorResponse) {
            return this.handleHttpErrorResponse(error, notificationService);
        } else {
            notificationService.notify({
                message: error.message,
                reportable: true,
                title: 'Uncaught error occured',
                type: AppNotificationType.ERROR,
            });
        }
        // eslint-disable-next-line no-console
        console.error('It happens: ', error);
    }

    /**
     * Handles HttpErrorResponses
     * @param errorResponse the response to handle
     * @param notificationService the notification service to be used
     */
    public handleHttpErrorResponse(errorResponse: HttpErrorResponse, notificationService: AppNotificationService): void {
        // Server or connection error happened
        if (this.isClientOffline()) {
            // Handle offline error
            return notificationService.notify({
                title: 'No Internet Connection',
                type: AppNotificationType.ERROR,
            });
        } else if (errorResponse.status) {
            if (errorResponse.status >= 500 && errorResponse.status < 600) {
                return notificationService.notify({
                    message: `${errorResponse.status} - ${errorResponse.message}`,
                    title: 'Server-Error',
                    type: AppNotificationType.ERROR,
                });
            } else if (errorResponse.status >= 400 && errorResponse.status < 500) {
                return notificationService.notify({
                    message: `${errorResponse.status} - ${errorResponse.message}`,
                    title: 'Request-Error',
                    type: AppNotificationType.ERROR,
                });
            }
        }
        notificationService.notify({
            title: 'Unknown HTTP-Error occured',
            type: AppNotificationType.ERROR,
        });
    }
}
