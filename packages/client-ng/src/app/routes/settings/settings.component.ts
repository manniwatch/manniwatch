/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopLocation } from '@manniwatch/api-types';
@Component({
    selector: 'app-settings',
    styleUrls: ['./settings.component.scss'],
    templateUrl: './settings.component.html',
})
export class SettingsComponent {
    private mStops: IStopLocation[] = [];
    constructor(private activatedRoute: ActivatedRoute) {
        const st: IStopLocation[] = this.activatedRoute.snapshot.data.stops.stops.sort((a: IStopLocation, b: IStopLocation): number =>
            a.name.localeCompare(b.name));
        this.mStops = st;

    }

    public hasHeader(idx: number): boolean {
        return idx === 0 || this.stops[idx].name.charAt(0) !== this.stops[idx - 1].name.charAt(0);
    }
    /**
     * The stops to be displayed
     * @returns a list of stops to be used
     */
    public get stops(): IStopLocation[] {
        return this.mStops;
    }

}
