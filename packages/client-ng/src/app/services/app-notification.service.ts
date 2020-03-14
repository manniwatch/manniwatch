/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { zip, Observable, Subject } from 'rxjs';
import { flatMap, map, startWith } from 'rxjs/operators';

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
    private notificationClosedSubject: Subject<void> = new Subject();
    constructor(private matSnackBar: MatSnackBar) {
        this.createNotificationQueueObservable()
            .subscribe((value: IAppNotificationDismiss): void => {
                this.notificationClosedSubject.next();
            });
    }

    /**
     * Creates an observable that returns the displayed Notification after it was viewed
     */
    public createNotificationQueueObservable(): Observable<IAppNotificationDismiss> {
        return zip(this.notificationSubject, this.notificationClosedSubject
            // tslint:disable-next-line:deprecation
            .pipe(startWith<undefined>(undefined)))
            .pipe(
                map((value: [IAppNotification, void]) => value[0]),
                flatMap((noti: IAppNotification): Observable<IAppNotificationDismiss> =>
                    this.matSnackBar.open(noti.title, undefined, {
                        announcementMessage: noti.title,
                        duration: 2000,
                    }).afterDismissed()
                        .pipe(map((dismissNotice: MatSnackBarDismiss): IAppNotificationDismiss =>
                            ({
                                dismissedByAction: dismissNotice.dismissedByAction,
                                notification: noti,
                            })))));
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
