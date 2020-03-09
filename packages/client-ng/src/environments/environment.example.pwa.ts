import { APP_VERSION } from './app-version';
import { IEnvironmentBase } from './environment.base';

export const environment: IEnvironmentBase = {
    apiEndpoint: '/',
    production: true,
    pwa: true,
    version: APP_VERSION,
};
