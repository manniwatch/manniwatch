/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
    if ('serviceWorker' in navigator && environment.production) {
        navigator.serviceWorker.register('/ngsw-worker.js');
    }
})
    // tslint:disable:no-console
    .catch((err: any) => console.error(err));
