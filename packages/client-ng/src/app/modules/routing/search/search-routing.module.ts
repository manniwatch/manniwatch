/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultResolver } from './search-result.resolver';
import { SearchComponent } from './search.component';

const tripPassagesRoute: Routes = [
    {
        component: SearchComponent,
        path: '',
        resolve: {
            results: SearchResultResolver,
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    },
];

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [
        RouterModule.forChild(tripPassagesRoute),
    ],
})
export class SearchRoutingModule { }
