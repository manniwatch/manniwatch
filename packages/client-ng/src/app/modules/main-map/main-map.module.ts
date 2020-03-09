/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatSnackBarModule,
} from '@angular/material';
import { MainMapDirective } from './main-map.directive';
@NgModule({
    declarations: [
        MainMapDirective,
    ],
    exports: [
        CommonModule,
        MatSnackBarModule,
        MainMapDirective,
    ],
    imports: [
        MatSnackBarModule,
        CommonModule,
    ],
})
export class MainMapModule { }
