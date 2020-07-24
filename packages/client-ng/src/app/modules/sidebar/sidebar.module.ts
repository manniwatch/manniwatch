/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { RequestUpdateDialogModule } from 'src/app/modules/request-update-dialog';
import { SidebarComponent } from './sidebar.component';

@NgModule({
    declarations: [
        SidebarComponent,
    ],
    exports: [
        CommonModule,
        MatDividerModule,
        MatListModule,
        MatIconModule,
        SidebarComponent,
        MatButtonModule,
    ],
    imports: [
        CommonModule,
        MatDividerModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        RequestUpdateDialogModule,
        RouterModule,
    ],
    providers: [
    ],
})
export class SidebarModule { }
