/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';
import { ITripPassage, VEHICLE_STATUS } from '@manniwatch/api-types';
import { TripInfoWithId } from '@manniwatch/client-types';
import {
    differenceInMinutes as dateDifferenceInMinutes,
    format as dateFormat,
    formatDistanceToNow as dateFormatDistanceToNow,
    parse as dateParse,
} from 'date-fns';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

/**
 * List of Departures Component
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-trip-passages-list',
    styleUrls: ['./trip-passages-list.component.scss'],
    templateUrl: './trip-passages-list.component.html',
})
export class TripPassagesListComponent {
    @Input({ transform: booleanAttribute })
    public displayPrevious:boolean=false;
    @Input()
    public set tripInfo(info: TripInfoWithId) {
        if (info) {
            this.previousPassages=[];
            const passages: ITripPassage[] = [];
            if (info.actual) {
                passages.push(...info.actual);
            }
            if (info.old && info.old.length > 0) {
                this.previousPassages.push(...info.old);
            }
            passages.sort((a: ITripPassage, b: ITripPassage): number => parseInt(a.stop_seq_num, 10) - parseInt(b.stop_seq_num, 10));
            this.passages = passages;
            return;
        }
        this.passages = [];
        this.previousPassages=[];
    }

    public previousPassages:ITripPassage[]=[];
    public passages: ITripPassage[] = [];

    /**
     * Returns if the atleast one passages was provided
     * @returns true if there is atleast one departure
     */
    public hasPassages(): boolean {
        return Array.isArray(this.passages) && this.passages.length > 0;
    }
    public  passageTime(passage:ITripPassage): string {
            // Maybe either of each is set but actualTime is prefered!
            const time: string = passage.actualTime || passage.plannedTime;
            if (time) {
                const planned: Date = dateParse(time, 'HH:mm', new Date());
                const diff: number = dateDifferenceInMinutes(planned, new Date());
                if (Math.abs(diff) < 15) {
                    return dateFormatDistanceToNow(planned, { addSuffix: true });
                }
                return dateFormat(planned, 'p');
            }
    }

    public listItemStyle(passage:ITripPassage){
        return {
            departed:passage?.status === VEHICLE_STATUS.DEPARTED,
            stopping:passage?.status === VEHICLE_STATUS.STOPPING,
        }
    }

    public getIcon(passage:ITripPassage){
        switch(passage?.status){
            case VEHICLE_STATUS.DEPARTED:
                return 'transfer_within_a_station';
            case VEHICLE_STATUS.STOPPING:
                return 'place';
            default:
                return 'directions_bus';
        }
    }
}
