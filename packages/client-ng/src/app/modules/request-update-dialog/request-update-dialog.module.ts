import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { RequestUpdateDialogComponent } from './request-update-dialog.component';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        RequestUpdateDialogComponent,
    ],
    entryComponents: [
        RequestUpdateDialogComponent,
    ],
    exports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        RequestUpdateDialogComponent,
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatProgressSpinnerModule,
    ],
    providers: [],
})
export class RequestUpdateDialogModule { }
