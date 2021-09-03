/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { runInsideZone } from '@donmahallem/rxjs-zone';
import { IVehicleLocation } from '@manniwatch/api-types';
import { Subscription } from 'rxjs';
import { IStaticMapData } from 'src/app/modules/openlayers';
import { TripPassagesService } from './trip-passages.service';
import {
    UpdateStatus,
} from './trip-util';
/**
 * Component displaying the TripPassages for a Trip
 */
@Component({
    providers: [
        TripPassagesService,
    ],
    selector: 'app-trip-passages',
    styleUrls: ['./trip-passages.component.scss'],
    templateUrl: './trip-passages.component.html',
})
export class TripPassagesComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    public headerMapData: IStaticMapData;
    public readonly STATUS_OPS: typeof UpdateStatus = UpdateStatus;
    constructor(public readonly zone: NgZone,
        public readonly passageService: TripPassagesService) { }

    public ngOnInit(): void {
        this.subscriptions.push(this.passageService
            .createStopLocationObservable()
            .pipe(runInsideZone(this.zone))
            .subscribe({
                next: (stopLocation: IVehicleLocation): void => {
                    if (stopLocation) {
                        this.headerMapData = {
                            map: {
                                center: stopLocation,
                            },
                            stops: undefined,
                            vehicles: [stopLocation],
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
