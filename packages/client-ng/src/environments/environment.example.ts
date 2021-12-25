/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
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
