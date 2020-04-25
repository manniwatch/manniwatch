/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HeaderBoxModule } from 'src/app/modules/header-box';
import { OlStaticMapModule } from 'src/app/modules/openlayers';
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
        HeaderBoxModule,
        OlStaticMapModule,
    ],
    providers: [
        TripPassagesResolver,
    ],
})
export class TripPassagesModule { }
