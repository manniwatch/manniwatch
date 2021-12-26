/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OlStaticMapDirective } from './ol-static-map.directive';

@NgModule({
    declarations: [OlStaticMapDirective],
    exports: [OlStaticMapDirective, CommonModule],
    imports: [CommonModule],
})
export class OlStaticMapModule {}
