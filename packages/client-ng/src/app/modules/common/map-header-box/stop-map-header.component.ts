/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { IStopLocation, IStopPassage, IStopPointLocation } from '@manniwatch/api-types';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { StopPointService } from 'src/app/services';
import { MapHeaderComponent } from './map-header.component';
import { StopLocationHeaderMapDirective } from './stop-location-map.directive';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-stop-map-header',
    styleUrls: ['./map-header.component.scss'],
    templateUrl: './stop-map-header.component.pug',
})
export class StopMapHeaderComponent extends MapHeaderComponent {

    @Input()
    public set stop(st: IStopPassage) {
        this.stopSubject.next(st);
    }

    public get stop(): IStopPassage {
        return this.stopSubject.getValue();
    }

    public get title(): string {
        if (this.stop) {
            return this.stop.stopName;
        }
        return undefined;
    }

    @ViewChild(StopLocationHeaderMapDirective, {
        static: true,
    })
    public map: StopLocationHeaderMapDirective;
    public readonly stopObservable: Observable<IStopPassage>;
    public readonly stopLocationObservable: Observable<IStopLocation | IStopPointLocation>;
    private readonly stopSubject: BehaviorSubject<IStopPassage>;
    constructor(private stopService: StopPointService) {
        super();
        this.stopSubject = new BehaviorSubject(undefined);
        this.stopObservable = this.stopSubject.asObservable()
            .pipe(tap(() => {
                this.lastUpdate = new Date();
            }), distinctUntilChanged((x: IStopPassage, y: IStopPassage): boolean => {
                if (x && y) {
                    return x.stopShortName === y.stopShortName;
                }
                return false;
            }));
        this.stopLocationObservable = this.stopObservable
            .pipe(switchMap((stop: IStopPassage): Observable<IStopLocation> => {
                if (stop) {
                    return this.stopService
                        .filterStop(stop.stopShortName);
                } else {
                    return of(undefined);
                }
            }));
    }
}
