/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { IVehiclePathInfo, TripId } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { from, BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { catchError, debounceTime, flatMap } from 'rxjs/operators';
import { RouteDisplayHandler } from 'src/app/leaflet';
import { ApiService } from 'src/app/services';
export interface IData {
    hovering: boolean;
    tripId?: TripId;
}
/**
 * Handles polling and displaying of route data on the map
 */
export class MainMapRouteDisplayHandler extends RouteDisplayHandler {
    private updateSubject: BehaviorSubject<IData> = new BehaviorSubject({
        hovering: false,
    });
    private subscription: Subscription;
    /**
     *
     * @param map The map to display the route on
     * @param api the api service to be used
     */
    constructor(map: L.Map, private api: ApiService) {
        super(map);
    }

    /**
     * Does start the updating loop
     */
    public start(): void {
        if (this.subscription && !this.subscription.closed) {
            return;
        }
        this.subscription = this.updateSubject
            .pipe(debounceTime(200))
            .pipe(flatMap((value: IData): Observable<IVehiclePathInfo> => {
                if (value.hovering) {
                    return this.api.getRouteByTripId(value.tripId)
                        .pipe(catchError(() => from([undefined])));
                } else {
                    return from([undefined]);
                }
            }))
            .subscribe(new Subscriber((value: any) => {
                if (value) {
                    if (value.paths && value.paths.length > 0) {
                        this.setRoutePaths(value.paths);
                        return;
                    }
                }
                this.clear();
            }));
    }

    /**
     * Does update the interal state. For display purposese calling start is required but doesn't require
     * to be called before.
     * @param isHovering indicates if the mouse is hovering
     * @param tripId optional TripId
     */
    public setMouseHovering(isHovering: boolean, tripId?: TripId): void {
        this.updateSubject.next({
            hovering: isHovering,
            tripId,
        });
    }

    /**
     * Has to be called to stop the underlying observable
     */
    public stop(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
