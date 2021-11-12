/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPreloadingStrategy } from './app-preloading-strategy';

const appRoutes: Routes = [
    {
        // eslint-disable-next-line 
        loadChildren: () => import('./routes/trip-passages').then((m) => m.TripPassagesModule),
        path: 'passages',
    },
    {
        // eslint-disable-next-line 
        loadChildren: () => import('./routes/stop').then((m) => m.StopModule),
        path: 'stop',
    },
    {
        // eslint-disable-next-line 
        loadChildren: () => import('./routes/stop-point').then((m) => m.StopPointModule),
        path: 'stopPoint',
    },
    {
        // eslint-disable-next-line 
        loadChildren: () => import('./routes/stops').then((m) => m.StopsModule),
        path: 'stops',
    },
    {
        // eslint-disable-next-line 
        loadChildren: () => import('./routes/error').then((m) => m.ErrorModule),
        path: 'error',
    },
    {
        // eslint-disable-next-line 
        loadChildren: () => import('./routes/search').then((m) => m.SearchModule),
        path: 'search',
    },
    {
        // eslint-disable-next-line
        loadChildren: () => import('./routes/settings').then((m) => m.SettingsModule),
        path: 'settings',
    },
    {
        children: [
        ],
        path: '',
    },
    {
        path: '**', redirectTo: '/error/not-found',
    },
];

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {
    enableTracing: false,
    preloadingStrategy: AppPreloadingStrategy,
    relativeLinkResolution: 'legacy',
}, // <-- debugging purposes only
        ),
    ],
    providers: [AppPreloadingStrategy],
})
export class AppRoutingModule { }
