/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import BaseTileLayer from 'ol/layer/BaseTile';

export type BackendType = 'nginx' | 'trapeze';
export interface IEnvironmentBase {
    readonly apiEndpoint: string;
    readonly backendType: BackendType;
    readonly map?: {
        center: {
            lat: number;
            lon: number;
        };
        zoom: number;
        /**
         * Map Provider to be used
         * Defaults to 'osm'
         */
        mapProvider?: 'osm' | BaseTileLayer;
    };
    readonly production: boolean;
    readonly pwa?: boolean;
    readonly version: string;
}
