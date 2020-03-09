/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Location } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { BehaviorSubject, Subscription } from 'rxjs';
import { createStopIcon } from 'src/app/leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { UserLocationService } from 'src/app/services/user-location.service';
import { LeafletMapComponent } from '../common/leaflet-map.component';

/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appStopLocation]',
})
export class StopLocationMapDirective extends LeafletMapComponent implements AfterViewInit, OnDestroy {
    @Input('location')
    public set location(loc: IStopLocation) {
        this.stopLocationSubject.next(loc);
    }
    private updateSubscription: Subscription;

    private stopMarkerLayer: L.FeatureGroup = undefined;

    private stopLocationSubject: BehaviorSubject<IStopLocation> = new BehaviorSubject(undefined);
    constructor(elRef: ElementRef,
                userLocationService: UserLocationService,
                zone: NgZone,
                settingsService: SettingsService,
                private locationService: Location) {
        super(elRef, zone, userLocationService, settingsService);
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        this.startUpdater();
        this.getMap().dragging.disable();
        this.getMap().touchZoom.disable();
        this.getMap().doubleClickZoom.disable();
        this.getMap().scrollWheelZoom.disable();
        this.getMap().eachLayer((layer: L.Layer) => {
            if (layer instanceof L.TileLayer) {
                layer.options.attribution = '';
                layer.redraw();
            }
        });
    }

    /**
     * Creates the Update Observable
     */
    public startUpdater(): void {
        if (this.updateSubscription) {
            return;
        }
        this.updateSubscription = this.stopLocationSubject
            .subscribe((location) => {
                if (this.stopMarkerLayer) {
                    this.stopMarkerLayer.clearLayers();
                } else {
                    this.stopMarkerLayer = new L.FeatureGroup();
                    this.stopMarkerLayer.addTo(this.getMap());
                }
                if (location) {
                    const stopIcon: L.Icon = createStopIcon(this.locationService);
                    const marker: L.Marker = L.marker([location.latitude / 3600000, location.longitude / 3600000],
                        {
                            icon: stopIcon,
                            interactive: false,
                            title: location.name,
                            zIndexOffset: 100,
                        });
                    marker.addTo(this.stopMarkerLayer);
                    this.getMap().panTo({
                        alt: 2000,
                        lat: location.latitude / 3600000,
                        lng: location.longitude / 3600000,
                    },
                        { animate: true });
                }
            });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }

}
