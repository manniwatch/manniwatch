import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatToolbarModule,
} from '@angular/material';
import { StopMapHeaderBoxModule } from '../common';
import { DepartureListItemComponent } from './departure-list-item.component';
import { DepartureListComponent } from './departure-list.component';
import { RouteListComponent } from './route-list.component';
import { StopPointInfoComponent } from './stop-point-info.component';
import { StopPointInfoResolver } from './stop-point-info.resolver';
import { StopPointRoutingModule } from './stop-point-routing.module';
@NgModule({
    declarations: [
        StopPointInfoComponent,
        DepartureListComponent,
        RouteListComponent,
        DepartureListItemComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        StopPointRoutingModule,
        MatTabsModule,
        StopMapHeaderBoxModule,
    ],
    providers: [
        StopPointInfoResolver,
    ],
})
export class StopPointModule { }
