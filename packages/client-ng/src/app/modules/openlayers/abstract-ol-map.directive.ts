/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { AfterViewInit, Directive, ElementRef, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Collection, Map, View } from 'ol';
import stylefunction from 'ol-mapbox-style/dist/stylefunction';
import { Coordinate } from 'ol/coordinate';
import MVT from 'ol/format/MVT';
import { defaults, Interaction } from 'ol/interaction';
import BaseTileLayer from 'ol/layer/BaseTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import { fromLonLat } from 'ol/proj';
import VectorTileSource from 'ol/source/VectorTile';
import { Subscription } from 'rxjs';
import { SettingsService, Theme } from 'src/app/services';
import { runOutsideZone } from 'src/app/util/rxjs';
import { DARK_THEME, LIGHT_THEME } from './theme';

@Directive()
export abstract class AbstractOlMapDirective implements AfterViewInit, OnDestroy, OnChanges {

    private map: Map;
    private locationSubscription: Subscription;
    private mBackgroundMapLayer: BaseTileLayer;
    private themeSubscription: Subscription;
    constructor(private elRef: ElementRef,
        public readonly zone: NgZone,
        public readonly settings: SettingsService) {
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

    public createMapLayer(): BaseTileLayer {
        return new VectorTileLayer({
            declutter: false,
            source: new VectorTileSource({
                attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
                    '© <a href="https://www.openstreetmap.org/copyright">' +
                    'OpenStreetMap contributors</a>',
                format: new MVT(),
                maxZoom: 14,
                url: 'https://d1u6l41epxe4hw.cloudfront.net/tiles/{z}/{x}/{y}.pbf',
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
        if (theme === Theme.DARK) {
            stylefunction(this.mBackgroundMapLayer, DARK_THEME, 'openmaptiles');
        } else {
            stylefunction(this.mBackgroundMapLayer, LIGHT_THEME, 'openmaptiles');
        }
    }

    public get backgroundMapLayer(): BaseTileLayer {
        return this.mBackgroundMapLayer;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.map) {
            this.map.updateSize();
        }
    }

    public getInteractions(): Collection<Interaction> {
        return defaults();
    }

    public onBeforeSetView(map: Map): void {

    }

    public onAfterSetView(map: Map): void {
        this.themeSubscription = this.settings
            .themeObservable
            .pipe(runOutsideZone(this.zone))
            .subscribe({
                next: (val: Theme): void => {
                    this.applyTheme(val);
                },
            });
    }

    public getMap(): Map | undefined {
        return this.map;
    }

    public ngOnDestroy(): void {
        this.map.dispose();
        if (this.locationSubscription) {
            this.locationSubscription.unsubscribe();
        }
        if (this.themeSubscription) {
            this.themeSubscription.unsubscribe();
        }
    }
}
