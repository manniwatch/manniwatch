/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HeaderBoxComponent } from './header-box.component';

@NgModule({
    declarations: [HeaderBoxComponent],
    exports: [HeaderBoxComponent],
    imports: [CommonModule, MatIconModule],
})
export class HeaderBoxModule {}
