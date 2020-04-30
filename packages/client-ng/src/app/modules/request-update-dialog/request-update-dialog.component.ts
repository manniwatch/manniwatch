/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RequestUpdateDialogService, SW_STATUS } from './request-update-dialog.service';

@Component({
    providers: [
        RequestUpdateDialogService,
    ],
    selector: 'app-request-update-dialog',
    styleUrls: ['./request-update-dialog.component.scss'],
    templateUrl: './request-update-dialog.component.html',
})
export class RequestUpdateDialogComponent implements OnInit, OnDestroy {

    private subscription: Subscription;
    public status: SW_STATUS = SW_STATUS.LOADING;
    constructor(public dialogService: RequestUpdateDialogService,
        public dialogRef: MatDialogRef<RequestUpdateDialogComponent>) {

    }

    public ngOnInit(): void {
        this.subscription = this.dialogService.statusObservable
            .subscribe({
                next: (status: SW_STATUS): void => {
                    this.dialogRef.disableClose = status === SW_STATUS.LOADING;
                    this.status = status;
                },
            });
    }

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
