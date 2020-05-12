/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { APP_VERSION } from './app-version';
import { IEnvironmentBase } from './environment.base';

export const environment: IEnvironmentBase = {
    apiEndpoint: '/',
    backendType: 'trapeze',
    map: {
        center: {
            lat: 0,
            lon: 0,
        },
        zoom: 0,
    },
    production: true,
    pwa: true,
    version: APP_VERSION,
};
