import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule, MatListModule } from '@angular/material';
import { VehicleMapHeaderBoxModule } from '../common';
import { TripPassagesListItemComponent } from './trip-passages-list-item.component';
import { TripPassagesListComponent } from './trip-passages-list.component';
import { TripPassagesRoutingModule } from './trip-passages-routing.module';
import { TripPassagesComponent } from './trip-passages.component';
import { TripPassagesResolver } from './trip-passages.resolver';
@NgModule({
    declarations: [
        TripPassagesComponent,
        TripPassagesListComponent,
        TripPassagesListItemComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        TripPassagesRoutingModule,
        VehicleMapHeaderBoxModule,
    ],
    providers: [
        TripPassagesResolver,
    ],
})
export class TripPassagesModule { }
