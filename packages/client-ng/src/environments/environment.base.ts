/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

export type BackendType = 'nginx' | 'trapeze';
export type TileProvider = {
    type: 'osm',
    /**
     * default is: https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png
     */
    url?: string,
} | {
    type: 'vector',
    url: string,
};
export interface IMapEnvironmentSettings {
    /**
     * Initial Map center
     * if not set center of bounds will be used if provided otherwise [0,0]
     */
    center?: {
        lat: number;
        lon: number;
    };
    /**
     * Bounds used to limit user move range on the map
     * useful if only partial map data is available
     */
    bounds?: {
        bottom: number,
        left: number,
        right: number,
        top: number,
    };
    zoom: {
        /**
         * default zoom level at start
         */
        default?: number,
        /**
         * minimum zoom level
         */
        min?: number,
        /**
         * maximum zoom level
         */
        max?: number,
    };
    /**
     * Specify map data provider.
     * Vectors do support dark/light mode swtich
     */
    tileProvider: TileProvider;
}

export interface IEnvironmentBase {
    readonly apiEndpoint: string;
    readonly backendType: BackendType;
    readonly map: IMapEnvironmentSettings;
    readonly production: boolean;
    readonly pwa?: boolean;
    readonly version: string;
}
