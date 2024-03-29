/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { AfterViewInit, Directive, ElementRef, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { runOutsideZone } from '@donmahallem/rxjs-zone';
import { Collection, Map, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { defaults, Interaction } from 'ol/interaction';
import BaseTileLayer from 'ol/layer/BaseTile';
import LayerRenderer from 'ol/renderer/Layer';
import { OSM, VectorTile } from 'ol/source';
import TileSource from 'ol/source/Tile';
import { Subscription } from 'rxjs';
import { SettingsService, Theme } from 'src/app/services';

@Directive() // eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseOlMapDirective<TILE extends BaseTileLayer<TileSource, LayerRenderer<any>>>
    implements AfterViewInit, OnDestroy, OnChanges
{
    protected map: Map;
    private locationSubscription: Subscription;
    protected mBackgroundMapLayer: TILE;
    private themeSubscription: Subscription;
    constructor(
        protected elRef: ElementRef,
        public readonly zone: NgZone,
        public readonly settings: SettingsService
    ) {}
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

    public abstract createMapLayer(): TILE;

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
    public abstract applyTheme(theme: Theme): void;

    public get backgroundMapLayer(): TILE {
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
        // Keep
    }

    public onAfterSetView(map: Map): void {
        this.themeSubscription = this.settings.themeObservable.pipe(runOutsideZone(this.zone)).subscribe({
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
