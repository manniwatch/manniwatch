/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Directive, ElementRef, HostBinding, NgZone } from '@angular/core';
import { Map as OlMap } from 'ol';
import { Coordinate } from 'ol/coordinate';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { SettingsService } from 'src/app/services/settings.service';
import { OlMapComponent } from '../openlayers';

/**
 * Directive displaying a map with the StopLocation
 */
@Directive()
export abstract class HeaderMapDirective extends OlMapComponent {

    @HostBinding('class.no-location')
    public blur: boolean = false;
    protected readonly markerVectorSource: VectorSource = undefined;
    protected readonly markerLayer: VectorLayer = undefined;

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
    }

    public panMapTo(panTo: Coordinate): void {
        if (this.getMap()) {
            this.getMap().updateSize();
            this.getMap().getView().animate({
                center: panTo,
                duration: 200,
                zoom: 16,
            });
        }
    }
}
