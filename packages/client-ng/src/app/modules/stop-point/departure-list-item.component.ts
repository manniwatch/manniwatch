/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';
import { IDeparture } from '@donmahallem/trapeze-api-types';
import { VEHICLE_STATUS } from '@donmahallem/trapeze-api-types/dist/vehicle-status';
import * as moment from 'moment';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-departure-list-item',
    styleUrls: ['./departure-list-item.component.scss'],
    templateUrl: './departure-list-item.component.pug',
})
export class DepartureListItemComponent {

    /**
     * Object holding the current departure
     * Can be undefined
     */
    private mDeparture: IDeparture = undefined;
    /**
     * The delay of the departure. Can be positive or negative excluding zero
     * or false if no delay is to be expected
     */
    private mDelay: boolean | number = false;
    /**
     * The time of arrival
     */
    private mTime: string = '';

    /**
     * Sets the departure
     * @param deps The departures
     */
    @Input('departure')
    public set departure(deps: IDeparture) {
        this.mDeparture = deps;
        this.mDelay = this.calculateDelay(deps);
        this.mTime = this.convertTime(deps);
    }

    /**
     * gets the departure
     * @returns the departure or undefined
     */
    public get departure(): IDeparture {
        return this.mDeparture;
    }

    public get time(): string {
        return this.mTime;
    }

    public get statusIcon(): string {
        switch (this.mDeparture.status) {
            case VEHICLE_STATUS.PREDICTED:
                return 'directions_bus';
            case VEHICLE_STATUS.DEPARTED:
                return 'directions_bus';
            case VEHICLE_STATUS.STOPPING:
                return 'departure_board';
            case VEHICLE_STATUS.PLANNED:
            default:
                return 'query_builder';
        }
    }

    /**
     * Returns the DepartureStatus
     * @returns vehicle status {@VEHICLE_STATUS}
     */
    public get status(): VEHICLE_STATUS {
        return this.mDeparture.status;
    }

    public convertTime(data: IDeparture): string {
        const time: number = data.actualRelativeTime;
        if (time > 300) {
            return data.actualTime;
        } else {
            return Math.ceil(time / 60) + 'min';
        }
    }

    /**
     * Returns the delay
     * @returns false or an integer except 0
     */
    public get delay(): boolean | number {
        return this.mDelay;
    }

    /**
     * Calculates the delay
     * @param data a number except 0 or false
     */
    public calculateDelay(data: IDeparture): false | number {
        if (data && data.actualTime && data.plannedTime) {
            if (data.actualTime !== data.plannedTime) {
                const actual: moment.Moment = moment(data.actualTime, 'HH:mm');
                const planned: moment.Moment = moment(data.plannedTime, 'HH:mm');
                let diffMinutes: number = moment.duration(actual.diff(planned)).asMinutes();
                if (diffMinutes > 60 * 12) {
                    diffMinutes -= 60 * 24;
                } else if (diffMinutes < - 60 * 12) {
                    diffMinutes += 60 * 24;
                }
                return diffMinutes;
            }
        }
        return false;
    }

}
