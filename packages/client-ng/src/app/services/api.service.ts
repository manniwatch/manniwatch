/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import {
    ISettings,
    IStopInfo,
    IStopLocations,
    IStopPassage,
    IStopPointLocations,
    IVehicleLocation,
    IVehicleLocationList,
    IVehiclePathInfo,
    StopMode,
} from '@manniwatch/api-types';
import { IBounds, TripInfoWithId } from '@manniwatch/client-types';
import { Observable } from 'rxjs';

export abstract class ApiService {
    abstract getTripPassages(tripId: string, mode?: StopMode): Observable<TripInfoWithId>;
    abstract getRouteByVehicleId(vehicleId: string): Observable<IVehiclePathInfo>;
    abstract getRouteByTripId(tripId: string): Observable<IVehiclePathInfo>;
    abstract getStopInfo(stopId: string): Observable<IStopInfo>;
    abstract getStopPassages(stopId: string,
        mode?: StopMode,
        startTime?: number,
        timeFrame?: number): Observable<IStopPassage>;
    abstract getStopPointPassages(stopPointId: string,
        mode?: StopMode,
        startTime?: number,
        timeFrame?: number): Observable<IStopPassage>;
    abstract getVehicleLocations(lastUpdate: number): Observable<IVehicleLocationList>;
    abstract getVehicleLocation(vehicleId: string, lastUpdate: number): Observable<IVehicleLocation>;
    abstract getStopLocations(bounds?: IBounds): Observable<IStopLocations>;
    abstract getStopPointLocations(bounds?: IBounds): Observable<IStopPointLocations>;
    abstract getSettings(): Observable<ISettings>;
}
