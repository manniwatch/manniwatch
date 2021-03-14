/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { IElectronInterface } from '@manniwatch/client-types';
import { contextBridge } from 'electron';
import { manniwatchApi } from './manniwatch-api';

const electronConfig: IElectronInterface = {
    api: manniwatchApi,
    environment: {
        apiEndpoint: 'mwa://api',
        map: {
            center: {
                lat: 195497852,
                lon: 36428988,
            },
            /**
             * Map Provider to be used
             * Defaults to 'osm'
             */
            mapProvider: {
                options: {
                    // format: new MVT(),
                    maxZoom: 14,
                    /**
                     * Please replace with correct url
                     * This one doesnt work!
                     */
                    url: 'tiles://vector/{z}/{x}/{y}.pbf',
                },
                type: 'vector',
            },
            zoom: 10,
        },
        production: false,
    } as any,
};

contextBridge.exposeInMainWorld(
    'electron',
    {
        manniwatch: electronConfig,
    },
);
