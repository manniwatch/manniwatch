/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input,
} from '@angular/core';
import { ITripPassage, VEHICLE_STATUS } from '@manniwatch/api-types';
import {
    differenceInMinutes as dateDifferenceInMinutes,
    format as dateFormat,
    formatDistanceToNow as dateFormatDistanceToNow,
    parse as dateParse,
} from 'date-fns';
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

    public get passageTime(): string {
        if (this.passage) {
            // Maybe either of each is set but actualTime is prefered!
            const time: string = this.passage.actualTime || this.passage.plannedTime;
            if (time) {
                const planned: Date = dateParse(time, 'HH:mm', new Date());
                const diff: number = dateDifferenceInMinutes(planned, new Date());
                if (Math.abs(diff) < 15) {
                    return dateFormatDistanceToNow(planned, { addSuffix: true });
                }
                return dateFormat(planned, 'p');
            }
        }
        return 'No departure time';
    }
}
