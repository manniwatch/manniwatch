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
} from '@manniwatch/api-types';
import { Extent } from 'ol/extent';
import { Observable } from 'rxjs';

export type TripInfoWithId = ITripPassages & { tripId: string };
export abstract class ApiService {

    abstract baseUrl(): string;

    abstract getTripPassages(tripId: string): Observable<TripInfoWithId>;
    abstract getRouteByVehicleId(vehicleId: string): Observable<IVehiclePathInfo>;
    abstract getRouteByTripId(tripId: string): Observable<IVehiclePathInfo>;
    abstract getStopInfo(stopId: string): Observable<IStopInfo>;
    abstract getStopPassages(stopId: string): Observable<IStopPassage>;
    abstract getStopPointPassages(stopPointId: string): Observable<IStopPassage>;
    abstract getVehicleLocations(lastUpdate: number): Observable<IVehicleLocationList>;
    abstract getVehicleLocation(vehicleId: string, lastUpdate: number): Observable<IVehicleLocation>;
    abstract getStopLocations(bounds?: Extent): Observable<IStopLocations>;
    abstract getStopPointLocations(bounds?: Extent): Observable<IStopPointLocations>;
    abstract getSettings(): Observable<ISettings>;
}
