import { getAppVersion } from './app-version';
import { IEnvironmentBase } from './environment.base';

export const environment: IEnvironmentBase = {
    apiEndpoint: 'https://kvg-api.xants.de/', // 'https://kvg-api.xants.de/',
    backendType: 'nginx',
    production: true,
    pwa: true,
    version: getAppVersion(),
};
