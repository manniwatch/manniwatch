/*
 * Package @manniwatch/client-desktop
 * Source https://manniwatch.github.io/manniwatch/
 */

import { ManniWatchApp } from './app';
import { ArgsCallback } from './cli/handle-cli';
import { AppConfig } from './config/config';

/* eslint-disable @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-unsafe-assignment */
export const appCallback: ArgsCallback = (config: AppConfig): void => {
    const trapezeApp: ManniWatchApp = new ManniWatchApp(config);
    trapezeApp
        .init()
        .then((): void => {
            // tslint:disable-next-line:no-console
            console.log('App started');
        })
        .catch((err: any): void => {
            // tslint:disable-next-line:no-console
            console.error('Error occured during startup', err);
        });
};
