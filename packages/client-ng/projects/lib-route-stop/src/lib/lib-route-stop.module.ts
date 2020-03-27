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
import { DepartureListItemComponent } from './departure-list-item.component';
import { DepartureListComponent } from './departure-list.component';
import { StopMapHeaderComponent } from './map-header';
import { RouteListComponent } from './route-list.component';
import { StopInfoComponent } from './stop-info.component';
import { StopInfoResolver } from './stop-info.resolver';
import { StopRoutingModule } from './stop-routing.module';
@NgModule({
    declarations: [
        StopInfoComponent,
        DepartureListComponent,
        RouteListComponent,
        DepartureListItemComponent,
        StopMapHeaderComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        StopRoutingModule,
        MatTabsModule,
    ],
    providers: [
        StopInfoResolver,
    ],
})
export class StopModule { }
