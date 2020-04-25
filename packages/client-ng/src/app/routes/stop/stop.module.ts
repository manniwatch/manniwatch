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
import { StopInfoComponent } from './stop-info.component';
import { StopInfoResolver } from './stop-info.resolver';
import { StopRoutingModule } from './stop-routing.module';
@NgModule({
    declarations: [
        StopInfoComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        StopRoutingModule,
        MatTabsModule,
        DepartureListModule,
        HeaderBoxModule,
        OlStaticMapModule,
        RouteListModule,
    ],
    providers: [
        StopInfoResolver,
    ],
})
export class StopModule { }
