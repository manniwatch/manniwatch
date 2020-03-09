import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatToolbarModule,
} from '@angular/material';
import { MapHeaderBoxModule } from '../common';
import { DepartureListItemComponent } from './departure-list-item.component';
import { DepartureListComponent } from './departure-list.component';
import { RouteListComponent } from './route-list.component';
import { StopInfoComponent } from './stop-info.component';
import { StopInfoResolver } from './stop-info.resolver';
import { StopLocationMapDirective } from './stop-map.directive';
import { StopRoutingModule } from './stop-routing.module';
@NgModule({
    declarations: [
        StopInfoComponent,
        DepartureListComponent,
        RouteListComponent,
        StopLocationMapDirective,
        DepartureListItemComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        StopRoutingModule,
        MatTabsModule,
        MapHeaderBoxModule,
    ],
    providers: [
        StopInfoResolver,
    ],
})
export class StopModule { }
