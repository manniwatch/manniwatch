/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { APP_VERSION } from './app-version';
import { IEnvironmentBase } from './environment.base';

export const environment: IEnvironmentBase = {
    apiEndpoint: 'https://kvg-api.xants.de/', // 'https://kvg-api.xants.de/',
    backendType: 'nginx',
    production: true,
    pwa: true,
    version: APP_VERSION,
};
