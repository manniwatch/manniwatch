/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SearchResultResolver } from './search-result.resolver';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
@NgModule({
    declarations: [
        SearchComponent,
    ],
    imports: [
        CommonModule,
        SearchRoutingModule,
        MatIconModule,
        MatListModule,
    ],
    providers: [
        SearchResultResolver,
    ],
})
export class SearchModule { }
