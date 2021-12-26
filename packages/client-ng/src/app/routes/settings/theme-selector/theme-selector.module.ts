/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ThemeSelectorComponent } from './theme-selector.component';

/**
 * Stops lazy loaded Module
 */
@NgModule({
    declarations: [ThemeSelectorComponent],
    imports: [CommonModule, MatIconModule, MatListModule],
    providers: [],
})
export class ThemeSelectorModule {}
