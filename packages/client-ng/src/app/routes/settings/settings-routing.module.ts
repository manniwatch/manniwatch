/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { ThemeSelectorComponent } from './theme-selector';

const settingsRoutes: Routes = [
    {
        component: ThemeSelectorComponent,
        path: 'theme',
    },
    {
        component: SettingsComponent,
        path: '',
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(settingsRoutes)],
})
export class SettingsRoutingModule {}
