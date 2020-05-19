/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OlMainMapDirective } from './ol-main-map.directive';
import { OlMainMapService } from './ol-main-map.service';
@NgModule({
    declarations: [
        OlMainMapDirective,
    ],
    exports: [
        CommonModule,
        OlMainMapDirective,
    ],
    imports: [
        CommonModule,
    ],
    providers: [
        OlMainMapService,
    ],
})
export class MainMapModule { }
