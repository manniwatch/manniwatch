/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(async (): Promise<void> => {
    if ('serviceWorker' in navigator && environment.production) {
        await navigator.serviceWorker.register('/ngsw-worker.js');
    }
})
    /* eslint-disable no-console, @typescript-eslint/no-explicit-any */
    .catch((err: any): void => console.error(err));
