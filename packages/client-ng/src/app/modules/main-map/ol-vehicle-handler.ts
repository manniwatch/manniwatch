/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { NgZone } from '@angular/core';
import { IVehicleLocation, IVehiclePathInfo, IWayPoint } from '@manniwatch/api-types';
import { Feature, Map as OlMap } from 'ol';
import { Coordinate } from 'ol/coordinate';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { combineLatest, of, Observable, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { TimestampedVehicleLocation } from 'src/app/services';
import { IData } from 'src/app/services/vehicle.service';
import { OlUtil } from 'src/app/util/ol';
import { runOutsideZone } from 'src/app/util/rxjs';
import { OlMainMapDirective } from './ol-main-map.directive';
export class OlVehicleHandler {

    /**
     * Layer for the stop markers to be displayed on the map
     */
    private vehicleMarkerLayer: VectorLayer;
    private vehicleMarkerVectorSource: VectorSource;
    private vehicleRouteLayer: VectorLayer;
    private vehicleRouteVectorSource: VectorSource;

    private loadSubscription: Subscription;
    private mouseHoverSubscription: Subscription;

    private selectVehicleSubscription: Subscription;
    public constructor(private mainMap: OlMainMapDirective) {
    }

    public start(leafletMap: OlMap): void {
        NgZone.assertNotInAngularZone();
        this.vehicleMarkerVectorSource = new VectorSource();
        this.vehicleRouteVectorSource = new VectorSource();
        this.vehicleMarkerLayer = new VectorLayer({
            declutter: false,
            source: this.vehicleMarkerVectorSource,
            zIndex: 1000,
        });
        this.vehicleRouteLayer = new VectorLayer({
            source: this.vehicleRouteVectorSource,
        });
        leafletMap.addLayer(this.vehicleRouteLayer);
        leafletMap.addLayer(this.vehicleMarkerLayer);

        const obs1: Observable<TimestampedVehicleLocation[]> = this.mainMap.vehicleSerivce
            .getVehicles
            .pipe(runOutsideZone(this.mainMap.zone),
                distinctUntilChanged((x: IData, y: IData): boolean => {
                    if (x && y) {
                        return x.lastUpdate === y.lastUpdate;
                    }
                    return false;
                }), pluck('vehicles'));

        const obs2: Observable<IVehiclePathInfo> = this.mainMap.mainMapService
            .statusObservable
            .pipe(runOutsideZone(this.mainMap.zone),
                switchMap((tripId: string): Observable<IVehiclePathInfo> => {
                    if (tripId) {
                        return this.mainMap.apiService.getRouteByTripId(tripId)
                            .pipe(catchError((err: any): Observable<IVehiclePathInfo> => {
                                return of(undefined);
                            }));
                    }
                    return of(undefined);
                }));
        this.loadSubscription = combineLatest([obs1, obs2])
            .subscribe((result: [TimestampedVehicleLocation[], IVehiclePathInfo]): void => {
                this.setVehicles(result[0]);
                this.setRoute(result[1]);
            });

    }

    public setRoute(vehiclePath: IVehiclePathInfo): void {
        this.vehicleRouteVectorSource.clear();
        if (vehiclePath) {
            const locations: Coordinate[] = vehiclePath.paths[0].wayPoints.map((wayPoint: IWayPoint): Coordinate => {
                return OlUtil.convertArcMSToCoordinate(wayPoint);
            });

            const polyline: LineString = new LineString(locations);
            const feature: Feature = new Feature(polyline);
            feature.setStyle(new Style({
                stroke: new Stroke({
                    color: [255, 111, 0, 0.8],
                    width: 6,
                }),
            }));
            this.vehicleRouteVectorSource.addFeature(feature);
        }
    }

    public isVehicleSelected(veh: IVehicleLocation): boolean {
        if (this.mainMap.mainMapService.selectedTrip) {
            return this.mainMap.mainMapService.selectedTrip === veh.tripId;
        }
        return false;
    }
    public setVehicles(stops: TimestampedVehicleLocation[]): void {
        NgZone.assertNotInAngularZone();
        if (this.vehicleMarkerVectorSource.getFeatures().length > 0) {
            this.vehicleMarkerVectorSource.clear(true);
        }
        const feats: Feature[] = stops.map((value: IVehicleLocation): Feature => {
            const endMarker: Feature = new Feature({
                geometry: new Point(OlUtil.convertArcMSToCoordinate(value)),
                type: this.isVehicleSelected(value) ? 'vehicle_selected' : 'vehicle',
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
        if (this.selectVehicleSubscription) {
            this.selectVehicleSubscription.unsubscribe();
        }
    }
}
