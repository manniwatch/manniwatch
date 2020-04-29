/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Notification Type
 */
export enum AppNotificationType {
    /**
     * Alert
     */
    ALERT = 1,
    /**
     * Info
     */
    INFO = 2,
    /**
     * Error
     */
    ERROR = 3,
}

export interface IAppNotification {
    /**
     * Notification Type
     */
    type?: AppNotificationType;
    /**
     * Notification Title
     */
    title: string;
    /**
     * Notification Message
     */
    message?: string;
    /**
     * Reportable
     */
    reportable?: boolean;
}

export interface IAppNotificationDismiss {
    dismissedByAction: boolean;
    notification: IAppNotification;
}

@Injectable({
    providedIn: 'root',
})
export class AppNotificationService {

    /**
     * Subject for replaying notifcations
     */
    private notificationSubject: Subject<IAppNotification> = new Subject();
    constructor() {
    }

    /**
     * Will publish the notification
     * @param noti the notification
     */
    public notify(noti: IAppNotification): void {
        this.notificationSubject.next(noti);
    }

    /**
     * The notification observable
     */
    public get notificationObservable(): Observable<any> {
        return this.notificationSubject.asObservable();
    }

    public report(err: any): void {

    }

}
