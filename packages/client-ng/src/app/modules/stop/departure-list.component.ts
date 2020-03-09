import {
    Component,
    Input,
} from '@angular/core';
import { IDeparture } from '@donmahallem/trapeze-api-types';

/**
 * List of Departures Component
 */
@Component({
    selector: 'app-departure-list',
    styleUrls: ['./departure-list.component.scss'],
    templateUrl: './departure-list.component.pug',
})
export class DepartureListComponent {

    private mDepartures: IDeparture[] = [];

    /**
     * set the departures
     */
    @Input('departures')
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
