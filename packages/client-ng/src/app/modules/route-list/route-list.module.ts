/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouteListComponent } from './route-list.component';

@NgModule({
    declarations: [RouteListComponent],
    exports: [CommonModule, MatDividerModule, MatListModule, RouteListComponent],
    imports: [CommonModule, MatDividerModule, MatListModule],
    providers: [],
})
export class RouteListModule {}
