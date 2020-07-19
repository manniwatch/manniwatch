/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { SettingsResolver } from './settings.resolver';

const tripPassagesRoute: Routes = [
    {
        component: SettingsComponent,
        path: '',
        resolve: {
            stops: SettingsResolver,
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
export class SettingsRoutingModule { }
