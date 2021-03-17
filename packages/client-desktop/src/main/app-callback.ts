/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { ManniWatchApp } from './app';
import { ArgsCallback } from './cli/handle-cli';
import { AppConfig } from './config/config';

export const appCallback: ArgsCallback = (config: AppConfig): void => {
    const trapezeApp: ManniWatchApp = new ManniWatchApp(config);
    trapezeApp.init()
        .then((): void => {
            // tslint:disable-next-line:no-console
            console.log('App started');
        })
        .catch((err: any): void => {
            // tslint:disable-next-line:no-console
            console.error('Error occured during startup', err);
        });
};
