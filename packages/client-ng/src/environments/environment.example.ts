/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import MVT from 'ol/format/MVT';
import { IEnvironmentBase } from '@manniwatch/client-types';

export const environment: IEnvironmentBase = {
    apiEndpoint: '/',
    map: {
        center: {
            lat: 0,
            lon: 0,
        },
        mapProvider: {
            options: {
                format: new MVT(),
                maxZoom: 14,
                /**
                 * Please replace with correct url
                 * This one doesnt work!
                 */
                url: 'https://manniwatch.github.io/tiles/{z}/{x}/{y}.pbf',
            },
            type: 'vector',
        },
        zoom: 0,
    },
    production: true,
    pwa: false,
};
