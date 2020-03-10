import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StopPointInfoComponent } from './stop-point-info.component';
import { StopPointInfoResolver } from './stop-point-info.resolver';

const tripPassagesRoute: Routes = [
    {
        component: StopPointInfoComponent,
        data: {
            openSidebar: true,
        },
        path: ':stopPointId',
        resolve: {
            stopPoint: StopPointInfoResolver,
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
export class StopPointRoutingModule { }
