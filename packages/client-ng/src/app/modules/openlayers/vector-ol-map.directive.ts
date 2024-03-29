/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { AfterViewInit, Directive, ElementRef, NgZone } from '@angular/core';
import { Map, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import MVT from 'ol/format/MVT';
import { defaults } from 'ol/interaction';
import BaseTileLayer from 'ol/layer/BaseTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import { fromLonLat } from 'ol/proj';
import { VectorTile } from 'ol/source';
import { stylefunction } from 'ol-mapbox-style';
import { SettingsService, Theme } from 'src/app/services';
import { environment } from 'src/environments';
import { BaseOlMapDirective } from './base-ol-map.directive';
import { DARK_THEME, LIGHT_THEME } from './theme';

@Directive()
export abstract class VectorOlMapDirective extends BaseOlMapDirective<VectorTileLayer> implements AfterViewInit {
    constructor(elRef: ElementRef, zone: NgZone, settings: SettingsService) {
        super(elRef, zone, settings);
    }
    public ngAfterViewInit(): void {
        this.zone.runOutsideAngular((): void => {
            // Seems to be necessary to run ngZone updates EVERY SINGLE TIME!!!! the map is firing a drag event
            this.mBackgroundMapLayer = this.createMapLayer();
            this.map = new Map({
                interactions: defaults(),
                layers: [this.mBackgroundMapLayer],
                target: this.elRef.nativeElement as HTMLElement,
                view: new View({
                    // projection: 'EPSG:3857', // 'EPSG:4326',
                    center: this.settings.getInitialMapCenter(),
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

    public createMapLayer(): VectorTileLayer {
        return new VectorTileLayer({
            declutter: false,
            source: new VectorTile({
                format: new MVT(),
                maxZoom: 14,
                /**
                 * Please replace with correct url
                 * This one doesnt work!
                 */
                url: environment.map.mapProvider.options.url,
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
        stylefunction(this.mBackgroundMapLayer, theme === Theme.DARK ? DARK_THEME : LIGHT_THEME, 'openmaptiles');
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public applyVectorTheme(theme: Theme): void {}
}
