/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Additional Data that can be provided to the dialog
 */
export interface IRetryDialogData {
    message?: string;
    code?: number;
}

@Component({
    selector: 'app-retry-dialog',
    standalone: false,
    styleUrls: ['./retry-dialog.component.scss'],
    templateUrl: './retry-dialog.component.html',
})
export class RetryDialogComponent {
    /**
     * Constructor
     * @param dialogRef Reference to the Dialog Component
     * @param data Additional data that can be provided to the Dialog
     */
    constructor(
        public dialogRef: MatDialogRef<RetryDialogComponent, boolean>,
        @Inject(MAT_DIALOG_DATA) public data: IRetryDialogData
    ) {}

    /**
     * OnClick Event
     */
    public onNoClick(): void {
        this.dialogRef.close(false);
    }
}
