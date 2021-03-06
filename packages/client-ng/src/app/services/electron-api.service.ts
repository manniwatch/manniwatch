/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import {
    ISettings,
    IStopInfo,
    IStopLocations,
    IStopPassage,
    IStopPointLocations,
    IVehicleLocation,
    IVehicleLocationList,
    IVehiclePathInfo,
} from '@manniwatch/api-types';
import { ipcRenderer } from 'electron';
import { from, Observable } from 'rxjs';
import { ApiService, IBounds, TripInfoWithId } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class WebApiService implements ApiService {

    public constructor() {
    }

    public baseUrl(): string {
        return 'electron';
    }

    public getTripPassages(tripId: string, mode: string = 'departure'): Observable<TripInfoWithId> {
        return from(ipcRenderer.invoke('api/trip/passages', tripId, mode));
    }

    public getRouteByVehicleId(vehicleId: string): Observable<IVehiclePathInfo> {
        return from(ipcRenderer.invoke('api/vehicle/route', vehicleId));
    }

    public getRouteByTripId(tripId: string): Observable<IVehiclePathInfo> {
        return from(ipcRenderer.invoke('api/trip/route', tripId));
    }

    public getStopInfo(stopId: string): Observable<IStopInfo> {
        return from(ipcRenderer.invoke('api/stop/info', stopId));
    }

    public getStopPassages(stopId: string): Observable<IStopPassage> {
        return from(ipcRenderer.invoke('api/stop/passages', stopId));
    }

    public getStopPointPassages(stopPointId: string): Observable<IStopPassage> {
        return from(ipcRenderer.invoke('api/stopPoint/passages', stopPointId));
    }

    public getVehicleLocations(lastUpdate: number = 0): Observable<IVehicleLocationList> {
        return from(ipcRenderer.invoke('api/geo/vehicles', lastUpdate));
    }

    public getVehicleLocation(vehicleId: string, lastUpdate: number = 0): Observable<IVehicleLocation> {
        return from(ipcRenderer.invoke('api/geo/vehicle', vehicleId, lastUpdate));
    }

    public getStopLocations(bounds?: IBounds): Observable<IStopLocations> {
        return from(ipcRenderer.invoke('api/geo/stops', bounds));
    }

    public getStopPointLocations(bounds?: IBounds): Observable<IStopPointLocations> {
        return from(ipcRenderer.invoke('api/geo/stopPoints', bounds));
    }

    public getSettings(): Observable<ISettings> {
        return from(ipcRenderer.invoke('api/settings'));
    }
}
