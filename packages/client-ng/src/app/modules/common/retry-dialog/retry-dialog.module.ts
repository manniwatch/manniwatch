/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RetryDialogComponent } from './retry-dialog.component';

@NgModule({
    declarations: [
        RetryDialogComponent,
    ],
    entryComponents: [
        RetryDialogComponent,
    ],
    exports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        RetryDialogComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
    ],
    providers: [
    ],
})
export class RetryDialogModule { }
