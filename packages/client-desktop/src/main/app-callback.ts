/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { ManniWatchApp } from './app';
import { ArgsCallback, IConfig } from './cli-commands';

export const appCallback: ArgsCallback = (config: IConfig): void => {
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
