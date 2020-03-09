import { getAppVersion } from './app-version';
import { IEnvironmentBase } from './environment.base';

export const environment: IEnvironmentBase = {
    apiEndpoint: 'https://ttss-api.xants.de/',
    backendType: 'nginx',
    production: false,
    pwa: false,
    version: getAppVersion(),
};
