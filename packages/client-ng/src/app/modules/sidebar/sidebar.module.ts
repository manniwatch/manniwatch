import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
} from '@angular/material';
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
    ],
    providers: [
    ],
})
export class SidebarModule { }
