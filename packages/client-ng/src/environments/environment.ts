/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { APP_VERSION } from './app-version';
import { IEnvironmentBase } from './environment.base';

export const environment: IEnvironmentBase = {
    apiEndpoint: 'https://ttss-api.xants.de/',
    // backendType: 'nginx',
    production: false,
    pwa: false,
    version: APP_VERSION,
};
