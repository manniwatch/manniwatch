/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { AfterViewInit, Directive, ElementRef, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Collection, Map, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { defaults, Interaction } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { fromLonLat } from 'ol/proj';
import MVT from 'ol/format/MVT';
import XYZ from 'ol/source/XYZ';
import { Subscription } from 'rxjs';
import { darkdata } from './dark';
import stylefunction from 'ol-mapbox-style/dist/stylefunction';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import { lightTheme } from './bright';
import { GlobalMapService } from './global-map.service';
import { runOutsideZone } from 'src/app/util/rxjs';
import VectorLayer from 'ol/layer/Vector';
import BaseLayer from 'ol/layer/Base';
import BaseTileLayer from 'ol/layer/BaseTile';

@Directive()
export abstract class AbstractOlMapDirective implements AfterViewInit, OnDestroy, OnChanges {

    private map: Map;
    private locationSubscription: Subscription;
    private mBackgroundMapLayer: BaseTileLayer;
    constructor(private elRef: ElementRef,
        public readonly zone: NgZone,
        public readonly globalMapService: GlobalMapService) {
    }
    public ngAfterViewInit(): void {
        this.zone.runOutsideAngular((): void => {
            // Seems to be necessary to run ngZone updates EVERY SINGLE TIME!!!! the map is firing a drag event
            this.mBackgroundMapLayer = this.createMapLayer();
            this.map = new Map({
                interactions: defaults(),
                layers: [/*
                    new TileLayer({
                        source: new XYZ({
                            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        }),
                    }),*/
                    this.mBackgroundMapLayer,
                ],
                target: this.elRef.nativeElement,
                view: new View({
                    // projection: 'EPSG:3857', // 'EPSG:4326',
                    center: fromLonLat(this.globalMapService.initialMapCenter),
                    extent: this.globalMapService.bounds,
                    maxZoom: this.globalMapService.zoomMax,
                    minZoom: this.globalMapService.zoomMin,
                    zoom: this.globalMapService.zoomDefault,
                }),
            });
            this.map.updateSize();
            this.onAfterSetView(this.map);
            this.globalMapService
                .isDarkThemeObservable
                .pipe(runOutsideZone(this.zone))
                .subscribe((isDark: boolean): void => {
                    this.applyTheme(isDark);
                });
        });

    }

    public createMapLayer(): BaseTileLayer {
        return this.globalMapService.tileLayer;
        /*
        return new VectorTileLayer({
            declutter: false,
            source: new VectorTileSource({
                attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
                    '© <a href="https://www.openstreetmap.org/copyright">' +
                    'OpenStreetMap contributors</a>',
                format: new MVT({
                    // layers: ['background', 'water', 'building', 'road_oneway']

                }),
                maxZoom: 14,
                url: 'https://d1u6l41epxe4hw.cloudfront.net/tiles/{z}/{x}/{y}.pbf',
            }),
        });*/
    }

    public applyTheme(dark: boolean): void {
        NgZone.assertNotInAngularZone();
        if (dark) {
            stylefunction(this.mBackgroundMapLayer, darkdata, 'openmaptiles');
        } else {
            stylefunction(this.mBackgroundMapLayer, lightTheme, 'openmaptiles');
        }
    }

    public get backgroundMapLayer(): BaseTileLayer {
        return this.mBackgroundMapLayer;
    }

    public panMapTo(panTo: Coordinate, zoom?: number): void {
        if (this.getMap()) {
            this.getMap().updateSize();
            this.getMap().getView().animate({
                center: panTo,
                duration: 200,
                zoom,
            });
        }
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

    }

    public getMap(): Map | undefined {
        return this.map;
    }

    public ngOnDestroy(): void {
        this.map.dispose();
        if (this.locationSubscription) {
            this.locationSubscription.unsubscribe();
        }
    }
}
