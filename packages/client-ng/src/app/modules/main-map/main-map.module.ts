import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OlMainMapDirective } from './ol-main-map.directive';
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
})
export class MainMapModule { }
