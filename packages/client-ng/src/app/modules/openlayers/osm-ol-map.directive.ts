/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import {
    AfterViewInit,
    Directive,
    ElementRef,
    NgZone,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from '@angular/core';
import { runOutsideZone } from '@donmahallem/rxjs-zone';
import { IOsmMapProvider, MapProvider } from '@manniwatch/client-types/dist/types/environment.base';
import { Collection, Map, View } from 'ol';
import stylefunction from 'ol-mapbox-style/dist/stylefunction';
import { Coordinate } from 'ol/coordinate';
import MVT from 'ol/format/MVT';
import { defaults, Interaction } from 'ol/interaction';
import BaseTileLayer from 'ol/layer/BaseTile';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import { fromLonLat } from 'ol/proj';
import { OSM, VectorTile } from 'ol/source';
import { Subscription } from 'rxjs';
import { SettingsService, Theme } from 'src/app/services';
import { environment } from 'src/environments';
import { AbstractOlMapDirective } from '.';
import { BaseOlMapDirective } from './base-ol-map.directive';
import { DARK_THEME, LIGHT_THEME } from './theme';

@Directive()
export abstract class OsmOlMapDirective extends BaseOlMapDirective<OSM> {

    constructor(elRef: ElementRef,
        zone: NgZone,
        settings: SettingsService) {
        super(elRef, zone, settings);
    }
    public ngAfterViewInit(): void {
        this.zone.runOutsideAngular((): void => {
            // Seems to be necessary to run ngZone updates EVERY SINGLE TIME!!!! the map is firing a drag event
            this.mBackgroundMapLayer = this.createMapLayer();
            this.map = new Map({
                interactions: defaults(),
                layers: [
                    this.mBackgroundMapLayer,
                ],
                target: this.elRef.nativeElement,
                view: new View({
                    // projection: 'EPSG:3857', // 'EPSG:4326',
                    center: fromLonLat(this.settings.getInitialMapCenter()),
                    maxZoom: 19,
                    minZoom: 1,
                    zoom: this.settings.getInitialMapZoom(),
                }),
            });
            this.map.updateSize();
            this.applyTheme(this.settings.theme);
            this.onAfterSetView(this.map);
        });
    }

    public createMapLayer(): BaseTileLayer<OSM> {
        if (environment.map.mapProvider.options) {
            return new TileLayer({
                source: new OSM(environment.map.mapProvider.options),
            });
        }
        // TODO: Take initial theme and set correct one
        return new TileLayer({
            source: new OSM({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            }),
        });
    }

    public panMapTo(panTo: Coordinate, zoom?: number): void {
        NgZone.assertNotInAngularZone();
        if (this.getMap()) {
            this.getMap().updateSize();
            this.getMap().getView().animate({
                center: panTo,
                duration: 200,
                zoom,
            });
        }
    }

    /**
     * Selected theme
     * @param theme theme to set
     */
    public applyTheme(theme: Theme): void {
        NgZone.assertNotInAngularZone();
        const mapProvider: any = environment.map.mapProvider;
        if (mapProvider?.options_dark && theme === Theme.DARK) {
            this.mBackgroundMapLayer.setSource(new OSM(mapProvider.options_dark));
        } else {
            this.mBackgroundMapLayer.setSource(new OSM(mapProvider.options));
        }
    }

    public applyVectorTheme(theme: Theme): void {
    }
}
