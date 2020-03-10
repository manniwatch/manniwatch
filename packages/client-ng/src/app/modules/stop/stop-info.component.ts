import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IStopLocation, IStopPassage } from '@donmahallem/trapeze-api-types';
import { StopInfoService } from './stop-info.service';

export interface IData {
    location?: IStopLocation;
    passages: IStopPassage;
}
@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [StopInfoService],
    selector: 'app-stop-info',
    styleUrls: ['./stop-info.component.scss'],
    templateUrl: './stop-info.component.pug',

})
export class StopInfoComponent {

    constructor(public stopInfoService: StopInfoService) { }

}
