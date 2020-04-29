/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DepartureListModule } from 'src/app/modules/departure-list';
import { HeaderBoxModule } from 'src/app/modules/header-box';
import { OlStaticMapModule } from 'src/app/modules/openlayers';
import { RouteListModule } from 'src/app/modules/route-list';
import { StopPointInfoComponent } from './stop-point-info.component';
import { StopPointInfoResolver } from './stop-point-info.resolver';
import { StopPointRoutingModule } from './stop-point-routing.module';
@NgModule({
    declarations: [
        StopPointInfoComponent,
    ],
    imports: [
        CommonModule,
        DepartureListModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        StopPointRoutingModule,
        MatTabsModule,
        HeaderBoxModule,
        OlStaticMapModule,
        RouteListModule,
    ],
    providers: [
        StopPointInfoResolver,
    ],
})
export class StopPointModule { }
