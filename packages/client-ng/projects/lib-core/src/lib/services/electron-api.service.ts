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

import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { ApiService, IBounds, TripInfoWithId } from './base-api.service';

@Injectable({
    providedIn: 'root',
})
export class ElectronApiService implements ApiService {

    private ipc: IpcRenderer;
    public constructor() {
        if ((window as any).require) {
            try {
                this.ipc = (window as any).require('electron').ipcRenderer;
            } catch (error) {
                throw error;
            }
        } else {
            console.warn('Could not load electron ipc');
        }
    }
    public baseUrl(): string {
        return '';
    }

    public getTripPassages(tripId: string): Observable<TripInfoWithId> {
        return from(this.ipc.invoke('api_get_trip_passages', tripId));
    }
    public getRouteByVehicleId(vehicleId: string): Observable<IVehiclePathInfo> {
        return from(this.ipc.invoke('api_get_route_by_vehicle_id', vehicleId));
    }
    public getRouteByTripId(tripId: string): Observable<IVehiclePathInfo> {
        return from(this.ipc.invoke('api_get_route_by_trip_id', tripId));
    }
    public getStopInfo(stopId: string): Observable<IStopInfo> {
        return from(this.ipc.invoke('api_get_stop_info', stopId));
    }
    public getStopPassages(stopId: string): Observable<IStopPassage> {
        return from(this.ipc.invoke('api_get_stop_passages', stopId));
    }
    public getStopPointPassages(stopPointId: string): Observable<IStopPassage> {
        return from(this.ipc.invoke('api_get_stop_point_passages', stopPointId));
    }
    public getVehicleLocations(lastUpdate: number): Observable<IVehicleLocationList> {
        return from(this.ipc.invoke('api_get_vehicle_locations', lastUpdate));
    }
    public getVehicleLocation(vehicleId: string, lastUpdate: number): Observable<IVehicleLocation> {
        return from(this.ipc.invoke('api_get_vehicle_location', vehicleId));
    }
    public getStopLocations(bounds?: IBounds): Observable<IStopLocations> {
        return from(this.ipc.invoke('api_get_stop_locations', bounds));
    }
    public getStopPointLocations(bounds?: IBounds): Observable<IStopPointLocations> {
        return from(this.ipc.invoke('api_get_stop_points_locations', bounds));
    }
    public getSettings(): Observable<ISettings> {
        return from(this.ipc.invoke('api_get_settings'));
    }
}
