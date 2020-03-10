/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { APP_VERSION } from './app-version';
import { IEnvironmentBase } from './environment.base';

export const environment: IEnvironmentBase = {
    apiEndpoint: '/',
    backendType: 'trapeze',
    production: true,
    pwa: false,
    version: APP_VERSION,
};
