/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Location } from '@angular/common';
import { Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IStopLocation, IStopPointLocation, IVehicleLocation } from '@manniwatch/api-types';
import { Map as OLMap } from 'ol';
import * as OlCondition from 'ol/events/condition';
import { Select } from 'ol/interaction';
import { SelectEvent } from 'ol/interaction/Select';
import Style from 'ol/style/Style';
import Feature, { FeatureLike } from 'ol/Feature';
import { Subscription } from 'rxjs';
import { AbstractOlMapDirective } from 'src/app/modules/openlayers';
import { ApiService, SettingsService } from 'src/app/services';
import { VehicleService } from 'src/app/services';
import { OlUtil } from 'src/app/util/ol';
import { StopPointService } from '../../services/stop-point.service';
import { OlMainMapService } from './ol-main-map.service';
import { OlMarkerHandler } from './ol-marker-handler';
import { OlVehicleHandler } from './ol-vehicle-handler';
@Directive({
    selector: 'map[appOlMainMap]',
})
/**
 * Directive for the main background map
 */
export class OlMainMapDirective extends AbstractOlMapDirective implements OnDestroy {
    public readonly mapSelectInteraction: Select;

    /**
     * Subscription for the update cycle for the vehicles
     */
    private vehicleUpdateSubscription: Subscription;
    private markerHandler: OlMarkerHandler;
    private vehicleHandler: OlVehicleHandler;
    /**
     * Constructor
     * @param elRef injected elementRef of the component root
     * @param apiService ApiService instance
     * @param router Router Instance
     * @param stopService Stop Service Instance for retrievel of stops
     * @param userLocationService UserLocationService Instance
     * @param location Browser Location
     * @param snackBar SnackbarService Instance
     * @param settings Settings Service
     * @param zone ngZone Instance
     */
    constructor(elRef: ElementRef,
        public apiService: ApiService,
        public router: Router,
        public stopService: StopPointService,
        public location: Location,
        settings: SettingsService,
        public vehicleSerivce: VehicleService,
        public mainMapService: OlMainMapService,
        zone: NgZone) {
        super(elRef, zone, settings);
        this.markerHandler = new OlMarkerHandler(this, 15);
        this.vehicleHandler = new OlVehicleHandler(this);
        this.mapSelectInteraction = new Select({
            condition: OlCondition.click,
            multi: false,
            style: (p0: FeatureLike, p1: number): Style | Style[] | void => {
                switch (p0.get('type')) {
                    case 'vehicle':
                        return OlUtil.createVehicleMarkerStyle(true)(p0, p1);
                    case 'stop':
                    case 'stopPoint':
                        return OlUtil.createStopMarkerStyle(true);
                    default:
                        return undefined;
                }
            },
            toggleCondition: OlCondition.never,
        });
    }
    public onClickStopPoint(stopPoint: IStopPointLocation): void {
        NgZone.assertNotInAngularZone();
        this.zone.run((): void => {
            this.router.navigate(['stopPoint', stopPoint.stopPoint]);
        });
    }

    public onClickStop(stop: IStopLocation): void {
        NgZone.assertNotInAngularZone();
        this.zone.run((): void => {
            this.router.navigate(['stop', stop.shortName]);
        });
    }
    public onClickVehicle(vehicle: IVehicleLocation): void {
        NgZone.assertNotInAngularZone();
        this.zone.run((): void => {
            this.router.navigate(['passages', vehicle.tripId]);
        });
    }

    public onAfterSetView(map: OLMap): void {

        this.markerHandler.start(map);
        this.vehicleHandler.start(map);
        this.getMap().addInteraction(this.mapSelectInteraction);
        this.mapSelectInteraction.on('select', (e: SelectEvent): void => {
            if (e.selected.length > 0) {
                const selectedFeature: Feature = e.selected[0];
                switch (selectedFeature.get('type')) {
                    case 'stopPoint':
                        this.onClickStopPoint(selectedFeature.get('stopPoint'));
                        break;
                    case 'stop':
                        this.onClickStop(selectedFeature.get('stop'));
                        break;
                    case 'vehicle':
                        this.onClickVehicle(selectedFeature.get('vehicle'));
                        break;
                }
            }
        });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.markerHandler.stop();
        this.vehicleHandler.stop();
        if (this.vehicleUpdateSubscription) {
            this.vehicleUpdateSubscription.unsubscribe();
        }
    }

}
