import { Injectable } from '@angular/core';
import { IVehiclePathInfo } from '@donmahallem/trapeze-api-types';
import { combineLatest, of, BehaviorSubject, Observable } from 'rxjs';
import { auditTime, catchError, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ApiService, TripInfoWithId } from 'src/app/services';
import { TimestampedVehicleLocation, VehicleService } from 'src/app/services';

export interface IStatus {
    location?: TimestampedVehicleLocation;
    route?: IVehiclePathInfo;
}
@Injectable()
export class VehicleMapHeaderService {
    public readonly statusObservable: Observable<IStatus>;
    public readonly tripInfoSubject: BehaviorSubject<TripInfoWithId> = new BehaviorSubject(undefined);
    constructor(public vehicleService: VehicleService,
                public apiService: ApiService) {
    }

    public createVehicleDataObservable(): Observable<IStatus> {
        return combineLatest([this.pollVehicleLocation(this.tripInfoSubject), this.pollVehicleRoute(this.tripInfoSubject)])
            .pipe(map((values: [TimestampedVehicleLocation, IVehiclePathInfo]): IStatus => ({
                location: values[0],
                route: values[1],
            })), auditTime(100));
    }
    public pollVehicleLocation(source: Observable<TripInfoWithId>): Observable<TimestampedVehicleLocation> {
        return source.pipe(switchMap((trip: TripInfoWithId): Observable<TimestampedVehicleLocation> => {
            // tslint:disable-next-line:triple-equals
            if (trip != undefined) {
                return this.vehicleService
                    .getVehicleByTripId(trip.tripId);
            } else {
                return of(undefined);
            }
        }), distinctUntilChanged((x: TimestampedVehicleLocation, y: TimestampedVehicleLocation) => {
            // tslint:disable-next-line:triple-equals
            if (x == undefined && y == undefined) {
                return true;
                // tslint:disable-next-line:triple-equals
            } else if (x != undefined && y != undefined) {
                return x.tripId === y.tripId && x.lastUpdate === y.lastUpdate;
            }
            return false;
        }));
    }

    public pollVehicleRoute(source: Observable<TripInfoWithId>): Observable<IVehiclePathInfo> {
        return source.pipe(switchMap((trip: TripInfoWithId): Observable<IVehiclePathInfo> => {
            // tslint:disable-next-line:triple-equals
            if (trip != undefined) {
                return this.apiService
                    .getRouteByTripId(trip.tripId)
                    .pipe(catchError((err: any): Observable<undefined> =>
                        of(undefined)));
            }
            return of(undefined);
        }));
    }

}
