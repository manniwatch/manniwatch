/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { IEnvironmentBase } from '@manniwatch/client-types';

export const environment: IEnvironmentBase = {
    apiEndpoint: '/',
    map: {
        center: {
            lat: 0,
            lon: 0,
        },
        zoom: 0,
    },
    production: true,
    pwa: false,
};
