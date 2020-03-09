import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPreloadingStrategy } from './app-preloading-strategy';

const appRoutes: Routes = [
    {
        loadChildren: () => import('./modules/trip-passages/trip-passages.module').then((m) => m.TripPassagesModule),
        path: 'passages',
    },
    {
        loadChildren: () => import('./modules/stop/stop.module').then((m) => m.StopModule),
        path: 'stop',
    },
    {
        loadChildren: () => import('./modules/stops/stops.module').then((m) => m.StopsModule),
        path: 'stops',
    },
    {
        loadChildren: () => import('./modules/error/error.module').then((m) => m.ErrorModule),
        path: 'error',
    },
    {
        loadChildren: () => import('./modules/routing/search/search.module').then((m) => m.SearchModule),
        path: 'search',
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
            }, // <-- debugging purposes only
        ),
    ],
    providers: [AppPreloadingStrategy],
})
export class AppRoutingModule { }
