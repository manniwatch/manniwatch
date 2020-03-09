import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
@Component({
    selector: 'app-stops-info',
    styleUrls: ['./stops-info.component.scss'],
    templateUrl: './stops-info.component.pug',
})
export class StopsInfoComponent {
    private mStops: IStopLocation[] = [];
    constructor(private activatedRoute: ActivatedRoute) {
        const st: IStopLocation[] = this.activatedRoute.snapshot.data.stops.stops.sort((a, b) =>
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
