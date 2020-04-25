/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { IStopLocation, IStopPassage } from '@manniwatch/api-types';
import { Subscription } from 'rxjs';
import { IStaticMapData } from 'src/app/modules/openlayers';
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
    templateUrl: './stop-info.component.html',

})
export class StopInfoComponent implements OnInit, OnDestroy {

    public headerMapData: IStaticMapData;
    private subscriptions: Subscription[] = [];
    public stopPassage: IStopPassage;
    constructor(public stopInfoService: StopInfoService) { }

    public ngOnInit(): void {
        this.subscriptions.push(this.stopInfoService
            .createStopPassageRefreshObservable()
            .subscribe({
                next: (val: IStopPassage): void => {
                    this.stopPassage = val;
                },
            }));
        this.subscriptions.push(this.stopInfoService
            .createStopLocationObservable()
            .subscribe({
                next: (stopLocation: IStopLocation): void => {
                    if (stopLocation) {
                        this.headerMapData = {
                            map: {
                                center: stopLocation,
                            },
                            stops: [stopLocation],
                            vehicles: undefined,
                        };
                    } else {
                        this.headerMapData = {
                            map: {
                                blur: true,
                                center: undefined,
                            },
                        };
                    }
                },
            }));
    }
    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub: Subscription): void => {
            sub.unsubscribe();
        });
        this.subscriptions = [];
    }
}
