/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { IStopPassage } from '@manniwatch/api-types';
import { Subscription } from 'rxjs';
import { IStaticMapData } from 'src/app/modules/openlayers';
import { StopPointInfoService } from './stop-point-info.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [StopPointInfoService],
    selector: 'app-stop-point-info',
    styleUrls: ['./stop-point-info.component.scss'],
    templateUrl: './stop-point-info.component.html',
})
export class StopPointInfoComponent implements OnInit, OnDestroy {

    public headerMapData: IStaticMapData;
    private subscriptions: Subscription[] = [];
    public stopPassage: IStopPassage;
    constructor(public stopInfoService: StopPointInfoService) {
    }

    public ngOnInit(): void {
        this.subscriptions.push(this.stopInfoService
            .createStopPointLocationObservable()
            .subscribe({
                next: (mapData: IStaticMapData): void => {
                    this.headerMapData = mapData;
                },
            }));
        this.subscriptions.push(this.stopInfoService
            .createStopPassageRefreshObservable()
            .subscribe({
                next: (mapData: IStopPassage): void => {
                    this.stopPassage = mapData;
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
