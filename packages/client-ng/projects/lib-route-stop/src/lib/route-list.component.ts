/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import {
    Component,
    Input,
} from '@angular/core';
import { IDeparture } from '@manniwatch/api-types';

@Component({
    selector: 'mwlr-stop-route-list',
    styleUrls: ['./route-list.component.scss'],
    templateUrl: './route-list.component.html',
})
export class RouteListComponent {

    private mDepartures: any[] = [];
    @Input('routes')
    public set routes(deps: any[]) {
        this.mDepartures = deps ? deps : [];
    }

    public get routes(): any[] {
        return this.mDepartures;
    }

    public get hasRoutes(): boolean {
        return this.mDepartures && this.mDepartures.length > 0;
    }
    public convertTime(time: number, data: IDeparture): string {
        if (time > 300) {
            return data.actualTime;
        } else {
            return Math.ceil(time / 60) + 'min';
        }
    }

}
