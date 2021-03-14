/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Inject, InjectionToken } from '@angular/core';
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
import { ApiService, IBounds, TripInfoWithId } from '@manniwatch/client-types';
import { from, EMPTY, Observable } from 'rxjs';
import { getManniwatchDesktopApi } from '../util/electron';
import { ApiService as RootApiService } from './api.service';

export const ELECTRON_API: InjectionToken<ApiService> = new InjectionToken<ApiService>('app.electron-api', {
    factory: (): ApiService => {
        return getManniwatchDesktopApi();
    },
    providedIn: 'root',
});
export class ElectronApiService implements RootApiService {

    public constructor(@Inject(ELECTRON_API) private readonly service: ApiService) {
        // tslint:disable-next-line:triple-equals
        if (service == undefined) {
            throw new Error('No electron config provided');
        }
    }

    public getTripPassages(tripId: string, mode: StopMode = 'departure'): Observable<TripInfoWithId> {
        return from(this.service.getTripPassages(tripId, mode));
    }

    public getRouteByVehicleId(vehicleId: string): Observable<IVehiclePathInfo> {
        return from(this.service.getRouteByVehicleId(vehicleId));
    }

    public getRouteByTripId(tripId: string): Observable<IVehiclePathInfo> {
        return from(this.service.getRouteByTripId(tripId));
    }

    public getStopInfo(stopId: string): Observable<IStopInfo> {
        return from(this.service.getStopInfo(stopId));
    }

    public getStopPassages(stopId: string,
        mode: StopMode = 'departure',
        startTime?: number,
        timeFrame?: number): Observable<IStopPassage> {
        return from(this.service.getStopPassages(stopId, mode, startTime, timeFrame));
    }

    public getStopPointPassages(stopPointId: string,
        mode: StopMode = 'departure',
        startTime?: number,
        timeFrame?: number): Observable<IStopPassage> {
        return from(this.service.getStopPointPassages(stopPointId, mode, startTime, timeFrame));
    }

    public getVehicleLocations(lastUpdate: number = 0): Observable<IVehicleLocationList> {
        return from(this.service.getVehicleLocations('RAW', lastUpdate));
    }

    public getVehicleLocation(vehicleId: string, lastUpdate: number = 0): Observable<IVehicleLocation> {
        return EMPTY; // from(this.service.getVehicleLocation(vehicleId, lastUpdate));
    }

    public getStopLocations(bounds?: IBounds): Observable<IStopLocations> {
        return from(this.service.getStopLocations(bounds));
    }

    public getStopPointLocations(bounds?: IBounds): Observable<IStopPointLocations> {
        return from(this.service.getStopPointLocations(bounds));
    }

    public getSettings(): Observable<ISettings> {
        return from(this.service.getSettings());
    }
}
