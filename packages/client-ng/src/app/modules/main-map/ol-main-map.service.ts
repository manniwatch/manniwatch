/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class OlMainMapService {
    public readonly statusObservable: Observable<string>;
    private readonly selectedVehicleSubject: BehaviorSubject<string> = new BehaviorSubject(undefined);
    constructor(private router: Router) {
        this.statusObservable = this.selectedVehicleSubject.asObservable();
        this.router
            .events
            .pipe(filter((evt: Event): boolean => {
                return evt instanceof NavigationEnd;
            }))
            .subscribe({
                next: (evt: NavigationEnd): void => {
                    if (evt.url.search(/\/passages\/[a-z0-9]+/i) >= 0) {
                        const splitUrl: string[] = evt.url.toLocaleLowerCase().split('\/');
                        const tripId: string = splitUrl[splitUrl.indexOf('passages') + 1];
                        this.selectedVehicleSubject.next(tripId);
                    } else {
                        this.selectedVehicleSubject.next(undefined);
                    }
                },
            });
    }
    public get selectedTrip(): string {
        return this.selectedVehicleSubject.value;
    }
}
