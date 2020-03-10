/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule,
} from '@angular/material';
import { VehicleLocationHeaderMapDirective } from './vehicle-location-map.directive';
import { VehicleMapHeaderBoxComponent } from './vehicle-map-header.component';

@NgModule({
    declarations: [
        VehicleMapHeaderBoxComponent,
        VehicleLocationHeaderMapDirective,
    ],
    exports: [
        CommonModule,
        MatIconModule,
        VehicleMapHeaderBoxComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
    ],
    providers: [
    ],
})
export class VehicleMapHeaderBoxModule { }
