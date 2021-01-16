/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Directive, ElementRef, HostBinding, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { IStopLocation, IVehicleLocation } from '@manniwatch/api-types';
import { Feature, Map as OlMap } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { SettingsService } from 'src/app/services';
import { OlUtil, TrapezeCoord } from 'src/app/util/ol';
import { AbstractOlMapDirective } from './abstract-ol-map.directive';

export interface IStaticMapData {
    stops?: IStopLocation[];
    vehicles?: IVehicleLocation[];
    map: {
        blur?: boolean,
        center?: TrapezeCoord,
        zoomLevel?: number,
    };
}
/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appOlStatic]',
})
export class OlStaticMapDirective extends AbstractOlMapDirective implements OnChanges {

    private readonly KEY_MAP_DATA: string = 'mapData';
    @HostBinding('class.no-location')
    public blur: boolean = false;
    protected readonly markerVectorSource: VectorSource = undefined;
    protected readonly markerLayer: VectorLayer = undefined;

    @Input()
    public mapData: IStaticMapData;
    constructor(elRef: ElementRef,
        zone: NgZone,
        settingsService: SettingsService) {
        super(elRef, zone, settingsService);
        this.markerVectorSource = new VectorSource();
        this.markerLayer = new VectorLayer({
            source: this.markerVectorSource,
        });
    }
    public onAfterSetView(map: OlMap): void {
        super.onAfterSetView(map);
        map.getInteractions().clear();
        map.getOverlays().clear();
        map.getControls().clear();
        map.addLayer(this.markerLayer);
        if (this.mapData) {
            this.updateMapData(this.mapData);
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.KEY_MAP_DATA in changes) {
            this.updateMapData(changes[this.KEY_MAP_DATA].currentValue);
        }
    }

    public updateMapData(mapData: IStaticMapData): void {
        // eslint-disable-next-line eqeqeq
        if (mapData == undefined) {
            return;
        }
        // NEVER RUN MAP UPDATES IN NG ZONE
        if (NgZone.isInAngularZone()) {
            this.zone.runOutsideAngular((): void => {
                this.updateMapData(mapData);
            });
            return;
        }
        NgZone.assertNotInAngularZone();
        this.blur = mapData.map.blur || false;
        // eslint-disable-next-line eqeqeq
        if (this.getMap() && mapData.map.center != undefined) {
            this.panMapTo(OlUtil.convertArcMSToCoordinate(mapData.map.center), mapData.map.zoomLevel);
        }
        if (this.markerVectorSource.getFeatures().length > 0) {
            this.markerVectorSource.clear(true);
        }
        if (mapData.stops) {
            const feats: Feature[] = mapData.stops.map((value: IStopLocation): Feature => {
                const endMarker: Feature = new Feature({
                    geometry: new Point(OlUtil.convertArcMSToCoordinate(value)),
                    stop: value,
                    type: 'stop',
                });
                endMarker.setStyle(OlUtil.createStyleByFeature(endMarker));
                return endMarker;
            });
            this.markerVectorSource.addFeatures(feats);
        }
        if (mapData.vehicles) {
            const feats: Feature[] = mapData.vehicles.map((value: IVehicleLocation): Feature => {
                const endMarker: Feature = new Feature({
                    geometry: new Point(OlUtil.convertArcMSToCoordinate(value)),
                    type: 'vehicle',
                    vehicle: value,
                });
                endMarker.setStyle(OlUtil.createStyleByFeature(endMarker));
                return endMarker;
            });
            this.markerVectorSource.addFeatures(feats);
        }
        this.markerLayer.changed();
    }
}
