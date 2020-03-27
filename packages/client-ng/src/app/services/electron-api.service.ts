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
} from '@manniwatch/api-types';
import { from, Observable } from 'rxjs';

import { ipcRenderer } from 'electron';
import { ApiService, TripInfoWithId } from './api.service';
import { Extent } from 'ol/extent';
import { Injectable } from '@angular/core';
@Injectable()
export class ElectronApiService implements ApiService {

    public baseUrl(): string {
        return '';
    }

    public getTripPassages(tripId: string): Observable<TripInfoWithId> {
        return from(ipcRenderer.invoke('api_get_trip_passages', tripId));
    }
    public getRouteByVehicleId(vehicleId: string): Observable<IVehiclePathInfo> {
        return from(ipcRenderer.invoke('api_get_route_by_vehicle_id', vehicleId));
    }
    public getRouteByTripId(tripId: string): Observable<IVehiclePathInfo> {
        return from(ipcRenderer.invoke('api_get_route_by_trip_id', tripId));
    }
    public getStopInfo(stopId: string): Observable<IStopInfo> {
        return from(ipcRenderer.invoke('api_get_stop_info', stopId));
    }
    public getStopPassages(stopId: string): Observable<IStopPassage> {
        return from(ipcRenderer.invoke('api_get_stop_passages', stopId));
    }
    public getStopPointPassages(stopPointId: string): Observable<IStopPassage> {
        return from(ipcRenderer.invoke('api_get_stop_point_passages', stopPointId));
    }
    public getVehicleLocations(lastUpdate: number): Observable<IVehicleLocationList> {
        return from(ipcRenderer.invoke('api_get_vehicle_locations', lastUpdate));
    }
    public getVehicleLocation(vehicleId: string, lastUpdate: number): Observable<IVehicleLocation> {
        return from(ipcRenderer.invoke('api_get_vehicle_location', vehicleId));
    }
    public getStopLocations(bounds?: Extent): Observable<IStopLocations> {
        return from(ipcRenderer.invoke('api_get_stop_locations', bounds));
    }
    public getStopPointLocations(bounds?: Extent): Observable<IStopPointLocations> {
        return from(ipcRenderer.invoke('api_get_stop_points_locations', bounds));
    }
    public getSettings(): Observable<ISettings> {
        return from(ipcRenderer.invoke('api_get_settings'));
    }
}
