/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
} from '@angular/core';
import { ITripPassage } from '@manniwatch/api-types';
import { VEHICLE_STATUS } from '@manniwatch/api-types/dist/vehicle-status';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-trip-passages-list-item',
    styleUrls: ['./trip-passages-list-item.component.scss'],
    templateUrl: './trip-passages-list-item.component.html',
})
export class TripPassagesListItemComponent {
    @Input()
    public passage: ITripPassage;

    @HostBinding('class.departed')
    public get departed(): boolean {
        return this.passage ? this.passage.status === VEHICLE_STATUS.DEPARTED : false;
    }
    @HostBinding('class.stopping')
    public get stopping(): boolean {
        return this.passage ? this.passage.status === VEHICLE_STATUS.STOPPING : false;
    }

}
