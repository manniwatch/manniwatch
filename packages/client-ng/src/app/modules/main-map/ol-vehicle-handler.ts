/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { NgZone } from '@angular/core';
import { IVehicleLocation, IVehicleLocationList } from '@manniwatch/api-types';
import { Feature, Map as OlMap } from 'ol';
import { OlUtil } from 'ol-map';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { runOutsideZone } from 'src/app/rxjs-util/run-outside-zone';
import { TimestampedVehicleLocation } from 'src/app/services';
import { OlMainMapDirective } from './ol-main-map.directive';
export class OlVehicleHandler {

    /**
     * Layer for the stop markers to be displayed on the map
     */
    private vehicleMarkerLayer: VectorLayer;
    private vehicleMarkerVectorSource: VectorSource;

    private loadSubscription: Subscription;
    private mouseHoverSubscription: Subscription;
    public constructor(private mainMap: OlMainMapDirective) {
    }

    public start(leafletMap: OlMap): void {
        NgZone.assertNotInAngularZone();
        this.vehicleMarkerVectorSource = new VectorSource();
        this.vehicleMarkerLayer = new VectorLayer({
            source: this.vehicleMarkerVectorSource,
        });
        leafletMap.addLayer(this.vehicleMarkerLayer);
        this.loadSubscription =
            this.mainMap.vehicleSerivce
                .getVehicles
                .pipe(runOutsideZone(this.mainMap.zone),
                    distinctUntilChanged((x: IVehicleLocationList, y: IVehicleLocationList): boolean => {
                        if (x && y) {
                            return x.lastUpdate === y.lastUpdate;
                        }
                        return false;
                    }), pluck('vehicles'))
                .subscribe((result: TimestampedVehicleLocation[]): void => {
                    this.setVehicles(result);
                });
    }

    public setVehicles(stops: TimestampedVehicleLocation[]): void {
        NgZone.assertNotInAngularZone();
        if (this.vehicleMarkerVectorSource.getFeatures().length > 0) {
            this.vehicleMarkerVectorSource.clear(true);
        }
        const feats: Feature[] = stops.map((value: IVehicleLocation): Feature => {
            const endMarker: Feature = new Feature({
                geometry: new Point(OlUtil.convertArcMSToCoordinate(value)),
                type: 'vehicle',
                vehicle: value,
            });
            endMarker.setStyle(OlUtil.createStyleByFeature(endMarker));
            return endMarker;
        });
        this.vehicleMarkerVectorSource.addFeatures(feats);
        this.vehicleMarkerLayer.changed();
    }
    public stop(): void {
        if (this.loadSubscription) {
            this.loadSubscription.unsubscribe();
            this.loadSubscription = undefined;
        }
        if (this.mouseHoverSubscription) {
            this.mouseHoverSubscription.unsubscribe();
            this.mouseHoverSubscription = undefined;
        }
    }
}
