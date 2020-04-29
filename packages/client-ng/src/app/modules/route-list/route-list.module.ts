/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouteListComponent } from './route-list.component';

@NgModule({
    declarations: [
        RouteListComponent,
    ],
    exports: [
        CommonModule,
        MatDividerModule,
        MatListModule,
        RouteListComponent,
    ],
    imports: [
        CommonModule,
        MatDividerModule,
        MatListModule,
    ],
    providers: [
    ],
})
export class RouteListModule { }
