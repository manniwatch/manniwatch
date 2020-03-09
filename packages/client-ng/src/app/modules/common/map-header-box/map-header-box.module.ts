/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule,
} from '@angular/material';
import { MapHeaderBoxComponent } from './map-header-box.component';

@NgModule({
    declarations: [
        MapHeaderBoxComponent,
    ],
    exports: [
        CommonModule,
        MatIconModule,
        MapHeaderBoxComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
    ],
    providers: [
    ],
})
export class MapHeaderBoxModule { }
