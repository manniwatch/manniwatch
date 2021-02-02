/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subscriber } from 'rxjs';
import { catchError, debounceTime, mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserLocationService {

    public get featureAvailable(): boolean {
        return (navigator.geolocation) ? true : false;
    }

    public get location(): GeolocationPosition {
        return this.locationSubject.value;
    }
    public get locationErrorObservable(): Observable<GeolocationPositionError> {
        return this.locationErrorSubject.asObservable();
    }
    public get locationObservable(): Observable<GeolocationPosition> {
        return this.locationSubject.asObservable();
    }

    private locationErrorSubject: BehaviorSubject<GeolocationPositionError> = new BehaviorSubject(undefined);

    private locationSubject: BehaviorSubject<GeolocationPosition> = new BehaviorSubject(undefined);
    public constructor() {
        this.locationErrorObservable
            .pipe(debounceTime(30000),
                mergeMap((val: GeolocationPositionError): Observable<GeolocationPosition> =>
                    this.createPositionRequest()),
                catchError((err: any): Observable<any> => {
                    this.locationErrorSubject.next(err);
                    return EMPTY;
                }))
            .subscribe((val: GeolocationPosition): void => {
                this.locationErrorSubject.next(undefined);
                this.locationSubject.next(val);
            });
    }

    public createPositionRequest(timeout: number = 10000, highAccuracy: boolean = false): Observable<GeolocationPosition> {
        return new Observable<any>((subscriber: Subscriber<GeolocationPosition>): void => {

            const geoSuccess: (position: GeolocationPosition) => void = (position: GeolocationPosition): void => {
                subscriber.next(position);
                subscriber.complete();
            };
            const geoError: (error: GeolocationPositionError) => void = (error: GeolocationPositionError): void => {
                subscriber.error(error);
            };
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
                enableHighAccuracy: highAccuracy,
                maximumAge: 5 * 60 * 1000, // Cache 5 minutes
                timeout,
            });
        });
    }

}
