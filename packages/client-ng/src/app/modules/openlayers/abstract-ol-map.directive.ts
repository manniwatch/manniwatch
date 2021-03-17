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
import { OSM } from 'ol/source';
import VectorTileSource from 'ol/source/VectorTile';
import { Subscription } from 'rxjs';
import { SettingsService, Theme } from 'src/app/services';
import { runOutsideZone } from 'src/app/util/rxjs';
import { environment } from 'src/environments';
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
        switch (environment.map.mapProvider.type) {
            case 'vector':
                environment.map.mapProvider.options.format = new MVT();
                return new VectorTileLayer({
                    declutter: false,
                    source: new VectorTileSource(environment.map.mapProvider.options),
                });
            case 'osm':
            default:
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
        const mapProvider: MapProvider = environment.map.mapProvider;
        if (mapProvider?.type === 'vector') {
            this.applyVectorTheme(theme);
        } else {
            this.applyTileTheme(theme, mapProvider);
        }
    }

    public applyVectorTheme(theme: Theme): void {
        stylefunction(this.mBackgroundMapLayer,
            theme === Theme.DARK ? DARK_THEME : LIGHT_THEME,
            'openmaptiles');
    }

    public applyTileTheme(theme: Theme, mapProvider: IOsmMapProvider): void {
        if (mapProvider?.options_dark && theme === Theme.DARK) {
            this.mBackgroundMapLayer.setSource(new OSM(mapProvider.options_dark));
        } else {
            this.mBackgroundMapLayer.setSource(new OSM(mapProvider.options));
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
