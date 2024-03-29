/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { RetryDialogModule } from 'src/app/modules/common/retry-dialog';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
/**
 * Stops lazy loaded Module
 */
@NgModule({
    declarations: [SettingsComponent],
    imports: [SettingsRoutingModule, CommonModule, MatIconModule, MatListModule, RetryDialogModule, MatDialogModule, RouterModule],
    providers: [],
})
export class SettingsModule {}
