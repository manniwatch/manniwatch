/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IDeparture } from '@manniwatch/api-types';

/**
 * List of Departures Component
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-departure-list',
    standalone: false,
    styleUrls: ['./departure-list.component.scss'],
    templateUrl: './departure-list.component.html',
})
export class DepartureListComponent {
    private mDepartures: IDeparture[] = [];

    /**
     * set the departures
     */
    @Input()
    public set departures(deps: IDeparture[]) {
        this.mDepartures = deps ? deps : [];
    }

    /**
     * departures
     */
    public get departures(): IDeparture[] {
        return this.mDepartures ? this.mDepartures : [];
    }

    /**
     * Returns if the atleast one departure was provided
     * @returns true if there is atleast one departure
     */
    public hasDepartures(): boolean {
        return this.mDepartures !== undefined && this.mDepartures.length > 0;
    }
}
