/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import {
    ISettings,
    IStopInfo,
    IStopLocations,
    IStopPassage,
    IStopPointLocations,
    ITripPassages,
    IVehicleLocation,
    IVehicleLocationList,
    IVehiclePathInfo,
    StopId,
    StopPointId,
    TripId,
    VehicleId,
} from '@donmahallem/trapeze-api-types';
import { Extent } from 'ol/extent';
import { Observable } from 'rxjs';

export type TripInfoWithId = ITripPassages & { tripId: TripId };
export abstract class ApiService {

    abstract baseUrl(): string;

    abstract getTripPassages(tripId: TripId): Observable<TripInfoWithId>;
    abstract getRouteByVehicleId(vehicleId: VehicleId): Observable<IVehiclePathInfo>;
    abstract getRouteByTripId(tripId: TripId): Observable<IVehiclePathInfo>;
    abstract getStopInfo(stopId: StopId): Observable<IStopInfo>;
    abstract getStopPassages(stopId: StopId): Observable<IStopPassage>;
    abstract getStopPointPassages(stopPointId: StopPointId): Observable<IStopPassage>;
    abstract getVehicleLocations(lastUpdate: number): Observable<IVehicleLocationList>;
    abstract getVehicleLocation(vehicleId: VehicleId, lastUpdate: number): Observable<IVehicleLocation>;
    abstract getStopLocations(bounds?: Extent): Observable<IStopLocations>;
    abstract getStopPointLocations(bounds?: Extent): Observable<IStopPointLocations>;
    abstract getSettings(): Observable<ISettings>;
}
