/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { IStopLocation, IStopLocations } from '@manniwatch/api-types';
@Component({
    selector: 'app-stops-info',
    styleUrls: ['./stops-info.component.scss'],
    templateUrl: './stops-info.component.html',
})
export class StopsInfoComponent {
    private mStops: IStopLocation[] = [];
    constructor(private activatedRoute: ActivatedRoute) {
        const data: Data & { stops?: IStopLocations } = this.activatedRoute.snapshot.data;
        const stops: IStopLocation[] | undefined = data?.stops?.stops;
        this.mStops = stops ? stops.sort((a: IStopLocation, b: IStopLocation): number => a.name.localeCompare(b.name)) : [];
    }

    public hasHeader(idx: number): boolean {
        return idx === 0 || this.stops[idx].name.charAt(0) !== this.stops[idx - 1].name.charAt(0);
    }
    /**
     * The stops to be displayed
     *
     * @returns a list of stops to be used
     */
    public get stops(): IStopLocation[] {
        return this.mStops;
    }
}
