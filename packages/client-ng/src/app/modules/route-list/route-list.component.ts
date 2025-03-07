/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component, Input } from '@angular/core';
import { IDeparture } from '@manniwatch/api-types';

@Component({
    selector: 'app-route-list',
    styleUrls: ['./route-list.component.scss'],
    templateUrl: './route-list.component.html',
    standalone: false
})
export class RouteListComponent {
    private mDepartures: IDeparture[] = [];
    @Input()
    public set routes(deps: IDeparture[]) {
        this.mDepartures = deps ? deps : [];
    }

    public get routes(): IDeparture[] {
        return this.mDepartures;
    }

    public get hasRoutes(): boolean {
        return this.mDepartures && this.mDepartures.length > 0;
    }
    public convertTime(time: number, data: IDeparture): string {
        if (time > 300) {
            return data.actualTime;
        } else {
            return `${Math.ceil(time / 60)}min`;
        }
    }
}
