/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';
import { IDeparture, VEHICLE_STATUS } from '@manniwatch/api-types';
import {
    add,
    differenceInMinutes,
    format,
    formatDistanceToNow,
    parse,
} from 'date-fns';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-departure-list-item',
    styleUrls: ['./departure-list-item.component.scss'],
    templateUrl: './departure-list-item.component.html',
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

    public convertTime(departure: IDeparture): string {
        if (departure) {
            const planned: Date = add(new Date(), {
                seconds: departure.actualRelativeTime,
            });
            const diff: number = differenceInMinutes(planned, new Date());
            if (Math.abs(diff) < 15) {
                return formatDistanceToNow(planned, { addSuffix: true });
            }
            return format(planned, 'p');
        }
        return 'No departure time';
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
                const actual: Date = parse(data.actualTime, 'HH:mm', new Date());
                const planned: Date = parse(data.plannedTime, 'HH:mm', new Date());
                let diffMinutes: number = differenceInMinutes(actual, planned);
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
