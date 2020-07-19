/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RetryDialogModule } from 'src/app/modules/common/retry-dialog';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsResolver } from './settings.resolver';

/**
 * Stops lazy loaded Module
 */
@NgModule({
    declarations: [
        SettingsComponent,
    ],
    imports: [
        SettingsRoutingModule,
        CommonModule,
        MatIconModule,
        MatListModule,
        RetryDialogModule,
        MatDialogModule,
    ],
    providers: [
        SettingsResolver,
    ],
})
export class SettingsModule { }
