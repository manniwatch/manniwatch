/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StopPointInfoService } from './stop-point-info.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [StopPointInfoService],
    selector: 'app-stop-point-info',
    styleUrls: ['./stop-point-info.component.scss'],
    templateUrl: './stop-point-info.component.html',

})
export class StopPointInfoComponent {

    constructor(public stopInfoService: StopPointInfoService) {
    }

}
