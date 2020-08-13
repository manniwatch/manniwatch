/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { OSM } from 'ol/source';
import VectorTileSource from 'ol/source/VectorTile';

export type BackendType = 'nginx' | 'trapeze';

export interface IVectorMapProvider {
    type: 'vector';
    source: VectorTileSource;
}
export interface IOsmMapProvider {
    type: 'osm';
    source?: OSM;
    /**
     * Dark Theme Map Tiles
     */
    source_dark?: OSM;
}

export type MapProvider = IVectorMapProvider | IOsmMapProvider;

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
        mapProvider?: MapProvider;
    };
    readonly production: boolean;
    readonly pwa?: boolean;
    readonly version: string;
}
