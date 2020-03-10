/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */


import { AfterViewInit, ElementRef, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Collection, Map, View } from 'ol';
import { defaults, Interaction } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

export abstract class OlMapComponent implements AfterViewInit, OnDestroy, OnChanges {

    private map: Map;
    private locationSubscription: Subscription;
    constructor(private elRef: ElementRef,
                public readonly zone: NgZone,
                public readonly settings: SettingsService) {
    }
    public ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {
            // Seems to be necessary to run ngZone updates EVERY SINGLE TIME!!!! the map is firing a drag event
            this.map = new Map({
                interactions: defaults(),
                layers: [
                    new TileLayer({
                        source: new XYZ({
                            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        }),
                    }),
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
