/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { IVehicleLocation, IVehiclePathInfo, IWayPoint } from '@manniwatch/api-types';
import { Feature, Map as OlMap } from 'ol';
import { Coordinate } from 'ol/coordinate';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { runOutsideZone } from 'src/app/rxjs-util/run-outside-zone';
import { SettingsService } from 'src/app/services/settings.service';
import { OlUtil } from '../openlayers';
import { HeaderMapDirective } from './header-map.directive';
import { IStatus, VehicleMapHeaderService } from './vehicle-map-header.service';

/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appVehicleLocationHeader]',
})
export class VehicleLocationHeaderMapDirective extends HeaderMapDirective implements OnDestroy {

    private updateVehicleSubscription: Subscription;
    private updateRouteSubscription: Subscription;
    private vehicleMarker: Feature;
    private routeMarker: Feature;
    constructor(elRef: ElementRef,
        zone: NgZone,
        settingsService: SettingsService,
        public headerService: VehicleMapHeaderService) {
        super(elRef, zone, settingsService);
    }

    public updateVehicle(vehicle: IVehicleLocation): void {
        const stopCoordinates: Coordinate = OlUtil.convertArcMSToCoordinate(vehicle);
        // tslint:disable-next-line:triple-equals
        if (this.vehicleMarker == undefined) {
            this.vehicleMarker = new Feature({
                geometry: new Point(stopCoordinates),
                type: 'vehicle',
                vehicle,
            });
            this.vehicleMarker.setStyle(OlUtil.createStyleByFeature(this.vehicleMarker));
            this.markerLayer.getSource().addFeature(this.vehicleMarker);
        } else {
            const p: Point = this.vehicleMarker.getGeometry() as Point;
            this.vehicleMarker.set('vehicle', vehicle);
            p.setCoordinates(stopCoordinates);
        }
        this.panMapTo(stopCoordinates);
        this.markerLayer.changed();
    }

    public updateRoute(route: IVehiclePathInfo): void {
        let polyline: LineString;
        // tslint:disable-next-line:triple-equals
        if (this.routeMarker == undefined) {
            polyline = new LineString([]);
            // Coordinates need to be in the view's projection, which is
            // 'EPSG:3857' if nothing else is configured for your ol.View instance

            this.routeMarker = new Feature({
                geometry: polyline,
                type: 'vehicle_route',
            });
            this.markerLayer.getSource().addFeature(this.routeMarker);
            this.markerLayer.setStyle(OlUtil.createStyleByFeature(this.routeMarker));
        } else {
            polyline = (this.routeMarker.getGeometry() as LineString);
        }
        if (route.paths) {
            for (const path of route.paths) {
                const pointList: Coordinate[] = path.wayPoints
                    .map((wayPoint: IWayPoint): Coordinate => OlUtil.convertArcMSToCoordinate(wayPoint));
                polyline.setCoordinates(pointList);
            }
        }
        // polyline.transform('EPSG:4326', 'EPSG:3857');
    }

    public onAfterSetView(map: OlMap): void {
        super.onAfterSetView(map);
        this.updateVehicleSubscription = this.headerService
            .createVehicleDataObservable()
            .pipe(debounceTime(100),
                tap((tapValue: IStatus): void => {
                    /**
                     * Required to set blur inside angular zone
                     */
                    // tslint:disable-next-line:triple-equals
                    this.blur = (tapValue.location == undefined);
                }), runOutsideZone(this.zone))
            .subscribe((loc: IStatus): void => {
                this.updateVehicle(loc.location);
                this.updateRoute(loc.route);
            });
    }
    public ngOnDestroy(): void {
        if (this.updateVehicleSubscription) {
            this.updateVehicleSubscription.unsubscribe();
        }
        if (this.updateRouteSubscription) {
            this.updateRouteSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }
}
