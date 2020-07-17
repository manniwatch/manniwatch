/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { AfterViewInit, Directive, ElementRef, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Collection, Map, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { defaults, Interaction } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import MVT from 'ol/format/MVT';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';

@Directive()
export abstract class AbstractOlMapDirective implements AfterViewInit, OnDestroy, OnChanges {

    private map: Map;
    private locationSubscription: Subscription;
    constructor(private elRef: ElementRef,
        public readonly zone: NgZone,
        public readonly settings: SettingsService) {
    }
    public ngAfterViewInit(): void {
        this.zone.runOutsideAngular((): void => {
            // Seems to be necessary to run ngZone updates EVERY SINGLE TIME!!!! the map is firing a drag event
            this.map = new Map({
                interactions: defaults(),
                layers: [/*
                    new TileLayer({
                        source: new XYZ({
                            attributions: '<a target="_blank" rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright">©OpenStreetMap</a>-Contributors',
                            attributionsCollapsible: false,
                            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        }),
                    }),*/
                    new VectorTileLayer({
                        declutter: false,
                        source: new VectorTileSource({
                            attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
                                '© <a href="https://www.openstreetmap.org/copyright">' +
                                'OpenStreetMap contributors</a>',
                            maxZoom: 14,
                            format: new MVT(),
                            url: "https://d1u6l41epxe4hw.cloudfront.net/tiles/{z}/{x}/{y}.pbf",
                        }),
                    })
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
            this.onAfterSetView(this.map);
        });
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
