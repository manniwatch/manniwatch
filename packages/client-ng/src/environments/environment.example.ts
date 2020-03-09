import { getAppVersion } from './app-version';
import { IEnvironmentBase } from './environment.base';

export const environment: IEnvironmentBase = {
    apiEndpoint: '/',
    production: true,
    pwa: false,
    version: getAppVersion(),
};
