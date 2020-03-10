import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StopsInfoComponent } from './stops-info.component';
import { StopsResolver } from './stops.resolver';

const tripPassagesRoute: Routes = [
    {
        component: StopsInfoComponent,
        path: '',
        resolve: {
            stops: StopsResolver,
        },
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
export class StopsRoutingModule { }
