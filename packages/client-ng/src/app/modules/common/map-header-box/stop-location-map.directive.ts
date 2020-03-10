/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Location } from '@angular/common';
import { Directive, ElementRef, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { IStopLocation, IStopPointLocation } from '@manniwatch/api-types';
import { Feature, Map as OlMap } from 'ol';
import { Coordinate } from 'ol/coordinate';
import Point from 'ol/geom/Point';
import { SettingsService } from 'src/app/services/settings.service';
import { OlUtil } from '../openlayers';
import { HeaderMapDirective } from './header-map.directive';

type StopTypes = IStopPointLocation | IStopLocation;
/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appStopLocationHeader]',
})
export class StopLocationHeaderMapDirective extends HeaderMapDirective implements OnChanges {
    @Input()
    public stop?: StopTypes;
    private stopMarker: Feature;
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService,
                public locationService: Location) {
        super(elRef, zone, settingsService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if ('stop' in changes) {
            const curStop: StopTypes = changes.stop.currentValue;
            const preStop: StopTypes = changes.stop.previousValue;
            if (curStop === undefined) {
                this.updateStop(undefined);
            }
            if (curStop && preStop && curStop.id === preStop.id) {
                return;
            }
            this.updateStop(curStop);
        }
    }

    public onAfterSetView(map: OlMap): void {
        super.onAfterSetView(map);
        this.updateStop(this.stop);
    }

    public updateStop(change: StopTypes): void {
        const stopCoordinates: Coordinate = OlUtil.convertArcMSToCoordinate(change);
        // tslint:disable-next-line:triple-equals
        if (this.stopMarker == undefined) {
            this.stopMarker = new Feature({
                geometry: new Point(stopCoordinates),
                type: 'stop',
            });
            this.stopMarker.setStyle(OlUtil.createStyleByFeature(this.stopMarker));
            this.markerLayer.getSource().addFeature(this.stopMarker);
        } else {
            const p: Point = this.stopMarker.getGeometry() as Point;
            p.setCoordinates(stopCoordinates);
        }
        this.panMapTo(stopCoordinates);
    }
}
