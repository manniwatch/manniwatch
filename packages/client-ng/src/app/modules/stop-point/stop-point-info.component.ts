import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StopPointInfoService } from './stop-point-info.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [StopPointInfoService],
    selector: 'app-stop-point-info',
    styleUrls: ['./stop-point-info.component.scss'],
    templateUrl: './stop-point-info.component.pug',

})
export class StopPointInfoComponent {

    constructor(public stopInfoService: StopPointInfoService) {
    }

}
