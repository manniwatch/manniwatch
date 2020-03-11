/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RetryDialogModule } from '../common/retry-dialog';
import { StopsInfoComponent } from './stops-info.component';
import { StopsRoutingModule } from './stops-routing.module';
import { StopsResolver } from './stops.resolver';

/**
 * Stops lazy loaded Module
 */
@NgModule({
    declarations: [
        StopsInfoComponent,
    ],
    imports: [
        StopsRoutingModule,
        CommonModule,
        MatIconModule,
        MatListModule,
        RetryDialogModule,
        MatDialogModule,
    ],
    providers: [
        StopsResolver,
    ],
})
export class StopsModule { }
