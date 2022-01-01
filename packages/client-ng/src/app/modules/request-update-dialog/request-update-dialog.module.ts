/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RequestUpdateDialogComponent } from './request-update-dialog.component';

@NgModule({
    declarations: [RequestUpdateDialogComponent],
    exports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule, RequestUpdateDialogComponent],
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
    providers: [],
})
export class RequestUpdateDialogModule {}
