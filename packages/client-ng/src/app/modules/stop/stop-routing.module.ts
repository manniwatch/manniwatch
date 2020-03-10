import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StopInfoComponent } from './stop-info.component';
import { StopInfoResolver } from './stop-info.resolver';

const tripPassagesRoute: Routes = [
    {
        component: StopInfoComponent,
        data: {
            openSidebar: true,
        },
        path: ':stopId',
        resolve: {
            stopInfo: StopInfoResolver,
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
export class StopRoutingModule { }
