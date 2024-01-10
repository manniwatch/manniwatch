/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HeaderBoxModule } from 'src/app/modules/header-box';
import { OlStaticMapModule } from 'src/app/modules/openlayers';
import { TripPassagesListComponent } from './trip-passages-list.component';
import { TripPassagesRoutingModule } from './trip-passages-routing.module';
import { TripPassagesComponent } from './trip-passages.component';
import { TripPassagesResolver } from './trip-passages.resolver';
@NgModule({
    declarations: [TripPassagesComponent, TripPassagesListComponent],
    imports: [CommonModule, MatIconModule, MatListModule, TripPassagesRoutingModule, HeaderBoxModule, OlStaticMapModule,MatSlideToggleModule],
    providers: [TripPassagesResolver],
})
export class TripPassagesModule {}
