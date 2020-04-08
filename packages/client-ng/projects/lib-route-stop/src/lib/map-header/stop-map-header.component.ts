/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'mwlr-stop-map-header',
    styleUrls: ['./stop-map-header.component.scss'],
    templateUrl: './stop-map-header.component.html',
})
export class StopMapHeaderComponent {
    @Input()
    public stop: any;
}
