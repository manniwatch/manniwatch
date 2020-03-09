import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonErrorComponent } from './common-error.component';
import { NotFoundComponent } from './not-found.component';

const errorRoutes: Routes = [
    {
        component: CommonErrorComponent,
        path: '',
    },
    {
        component: NotFoundComponent,
        path: 'not-found',
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [
        RouterModule.forChild(errorRoutes),
    ],
})
export class ErrorRoutingModule { }
