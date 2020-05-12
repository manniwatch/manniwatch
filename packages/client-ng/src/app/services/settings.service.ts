/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { ISettings } from '@manniwatch/api-types';
import { from, Observable, Subscriber, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from 'src/environments';

// tslint:disable:max-classes-per-file
export class SettingsLoadSubscriber extends Subscriber<void> {
    public constructor(private resolve: (arg: void) => void) {
        super();
    }

    public error(err: any): void {
        this.resolve();
        // tslint:disable-next-line:no-console
        console.error(err);
    }

    public complete(): void {
        this.resolve();
    }
}

@Injectable(
    { providedIn: 'root' },
)
export class SettingsService {


    constructor() {

    }

    public getInitialMapCenter(): [number, number] {
        if (environment.map &&
            environment.map.center &&
            environment.map.center.lat &&
            environment.map.center.lon) {
            return [environment.map.center.lon / 3600000, environment.map.center.lat / 3600000];
        }
        return [0, 0];
    }
    public getInitialMapZoom(): number {
        if (environment.map) {
            return environment.map.zoom;
        }
        return 13;
    }
}
