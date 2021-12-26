/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RetryDialogModule } from 'src/app/modules/common/retry-dialog';
import { StopsInfoComponent } from './stops-info.component';
import { StopsRoutingModule } from './stops-routing.module';
import { StopsResolver } from './stops.resolver';

/**
 * Stops lazy loaded Module
 */
@NgModule({
    declarations: [StopsInfoComponent],
    imports: [StopsRoutingModule, CommonModule, MatIconModule, MatListModule, RetryDialogModule, MatDialogModule],
    providers: [StopsResolver],
})
export class StopsModule {}
