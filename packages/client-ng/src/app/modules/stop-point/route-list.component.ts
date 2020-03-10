import {
    Component,
    Input,
} from '@angular/core';

@Component({
    selector: 'app-route-list',
    styleUrls: ['./route-list.component.scss'],
    templateUrl: './route-list.component.pug',
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

}
