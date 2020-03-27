/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { APP_VERSION } from './app-version';
import { IEnvironmentBase } from './environment.base';

export const environment: IEnvironmentBase = {
    apiService: '/',
    production: true,
    pwa: true,
    version: APP_VERSION,
};
