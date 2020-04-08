/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TripInfoWithId } from 'lib-core';
import { MapHeaderDirective } from './map-header.component';
import { VehicleMapHeaderService } from './vehicle-map-header.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        VehicleMapHeaderService,
    ],
    selector: 'app-vehicle-map-header',
    styleUrls: ['./map-header.component.scss'],
    templateUrl: './vehicle-map-header.component.html',
})
export class VehicleMapHeaderBoxComponent extends MapHeaderDirective {

    public constructor(private mapHeaderService: VehicleMapHeaderService) {
        super();
    }

    @Input()
    public set tripInfo(trip: TripInfoWithId) {
        this.mapHeaderService.tripInfoSubject.next(trip);
    }

    public get title(): string {
        if (this.tripInfo) {
            return this.tripInfo.routeName + ' - ' + this.tripInfo.directionText;
        }
        return undefined;
    }
}
