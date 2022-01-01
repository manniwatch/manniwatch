/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CountdownTimerDirective } from './countdown-timer.directive';

/**
 * Module containing the CountdownDirective
 */
@NgModule({
    declarations: [CountdownTimerDirective],
    exports: [CommonModule, MatIconModule, CountdownTimerDirective],
    imports: [CommonModule, MatIconModule],
    providers: [],
})
export class CountdownTimerModule {}
