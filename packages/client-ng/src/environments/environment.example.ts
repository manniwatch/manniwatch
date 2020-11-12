/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import MVT from 'ol/format/MVT';
import VectorTileSource from 'ol/source/VectorTile';
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
        mapProvider: {
            source: new VectorTileSource({
                format: new MVT(),
                maxZoom: 14,
                /**
                 * Please replace with correct url
                 * This one doesnt work!
                 */
                url: 'https://manniwatch.github.io/tiles/{z}/{x}/{y}.pbf',
            }),
            type: 'vector',
        },
        zoom: 0,
    },
    production: true,
    pwa: false,
    version: APP_VERSION,
};
