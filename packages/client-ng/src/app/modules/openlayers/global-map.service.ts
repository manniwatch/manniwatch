/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { getCenter, Extent, boundingExtent } from 'ol/extent';
import { fromEvent, of, Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { Coordinate } from 'ol/coordinate';
import { OSM, Vector } from 'ol/source';
import { environment } from 'src/environments';
import Layer from 'ol/layer/Layer';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import TileLayer from 'ol/layer/Tile';
import MVT from 'ol/format/MVT';
import { fromLonLat } from 'ol/proj';

@Injectable({ providedIn: 'root' })
export class GlobalMapService {
    public readonly isDarkThemeObservable: Observable<boolean>;
    constructor() {
        /**
         * Check if prefers-color-scheme is supported
         */
        if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
            const themeQuery: MediaQueryList = window.matchMedia('(prefers-color-scheme:dark)');
            this.isDarkThemeObservable = fromEvent(themeQuery, 'change')
                .pipe(map((evt: MediaQueryListEvent): boolean => {
                    return evt.matches;
                }), startWith(themeQuery.matches),
                    shareReplay(1));
        } else {
            this.isDarkThemeObservable = of(false);
        }
    }

    public get initialMapCenter(): Coordinate {
        if (environment.map.center) {
            return [environment.map.center.lon / 3600000, environment.map.center.lat / 3600000];
        } else if (environment.map.bounds) {
            return getCenter(this.bounds);
        }
        return [0, 0];
    }

    public get zoomDefault(): number {
        return environment.map?.zoom?.default ?? 12;
    }

    public get zoomMin(): number {
        return environment.map?.zoom?.min ?? 1;
    }
    public get zoomMax(): number {
        return environment.map?.zoom?.max ?? 15;
    }

    public get bounds(): Extent {
        const topLeft: Coordinate = fromLonLat([environment.map?.bounds?.left ?? -180, environment.map?.bounds?.top ?? -90]);
        const bottomRight: Coordinate = fromLonLat([environment.map?.bounds?.right ?? -180, environment.map?.bounds?.bottom ?? -90]);
        return boundingExtent([topLeft, bottomRight]);
    }

    public get tileLayer(): VectorTileLayer | TileLayer {
        switch (environment.map.tileProvider.type) {
            case 'vector':
                return new VectorTileLayer({
                    declutter: false,
                    source: new VectorTileSource({
                        attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
                            '© <a href="https://www.openstreetmap.org/copyright">' +
                            'OpenStreetMap contributors</a>',
                        maxZoom: 14,
                        url: environment.map.tileProvider.url,
                    }),
                });
            case 'osm':
            default:
                return new TileLayer({
                    source: new OSM({
                        url: environment.map.tileProvider.url ??
                            'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    }),
                });
        }
    }
}
