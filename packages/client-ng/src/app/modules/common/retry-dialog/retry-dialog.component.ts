/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/**
 * Additional Data that can be provided to the dialog
 */
export class RetryDialogData {
    message?: string;
    code?: number;
}

@Component({
    selector: 'app-retry-dialog',
    styleUrls: ['./retry-dialog.component.scss'],
    templateUrl: './retry-dialog.component.pug',
})
export class RetryDialogComponent {
    /**
     * Constructor
     * @param dialogRef Reference to the Dialog Component
     * @param data Additional data that can be provided to the Dialog
     */
    constructor(public dialogRef: MatDialogRef<RetryDialogComponent, boolean>,
                @Inject(MAT_DIALOG_DATA) public data: RetryDialogData) { }

    /**
     * OnClick Event
     */
    public onNoClick(): void {
        this.dialogRef.close(false);
    }
}
