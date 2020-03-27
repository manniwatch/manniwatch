/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IStopLocation, IStopPassage } from '@manniwatch/api-types';
import { StopInfoService } from './stop-info.service';

export interface IData {
    location?: IStopLocation;
    passages: IStopPassage;
}
@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [StopInfoService],
    selector: 'mwlr-stop-info',
    styleUrls: ['./stop-info.component.scss'],
    templateUrl: './stop-info.component.html',

})
export class StopInfoComponent {

    constructor(public stopInfoService: StopInfoService) { }

}
