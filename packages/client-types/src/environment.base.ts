/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-types
 */

import { Options as OsmOption } from 'ol/source/OSM';
import { Options as VectorOptions } from 'ol/source/VectorTile';

export interface IVectorMapProvider {
    type: 'vector';
    options: VectorOptions;
}

export interface IOsmMapProvider {
    type: 'osm';
    source?: OsmOption;
    /**
     * Dark Theme Map Tiles
     */
    source_dark?: OsmOption;
}

export type MapProvider = IVectorMapProvider | IOsmMapProvider;

export interface IEnvironmentBase {
    readonly apiEndpoint: string;
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
