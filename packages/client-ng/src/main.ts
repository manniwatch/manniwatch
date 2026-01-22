/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
    .then((): void => {
        if ('serviceWorker' in navigator && environment.production) {
            void navigator.serviceWorker.register('/ngsw-worker.js');
        }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((err: any): void => console.error(err));
