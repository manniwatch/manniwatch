/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { defaultIfEmpty, Observable, Subject } from 'rxjs';
import { RetryDialogComponent } from '../modules/common/retry-dialog';

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

export interface IConfirmationDialogSettings {
    msg: string;
}

@Injectable({
    providedIn: 'root',
})
export class AppDialogService {
    public constructor(public readonly dialog: MatDialog) {}

    public getRetryDialog(cfg: IConfirmationDialogSettings): Observable<boolean> {
        return this.getConfirmation(cfg, RetryDialogComponent).pipe(defaultIfEmpty(false));
    }

    public getConfirmation<T, D = unknown, R = boolean>(cfg: D, cmp: ComponentType<T>): Observable<R> {
        return this.dialog
            .open<T, D, R>(cmp, {
                data: cfg,
            })
            .afterClosed();
    }
}
