/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule,
} from '@angular/material';
import { StopLocationHeaderMapDirective } from './stop-location-map.directive';
import { StopMapHeaderComponent } from './stop-map-header.component';

@NgModule({
    declarations: [
        StopMapHeaderComponent,
        StopLocationHeaderMapDirective,
    ],
    exports: [
        CommonModule,
        MatIconModule,
        StopMapHeaderComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
    ],
    providers: [
    ],
})
export class StopMapHeaderBoxModule { }
