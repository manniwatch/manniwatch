/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import {
    ISettings,
    IStopInfo,
    IStopLocations,
    IStopPassage,
    IStopPointInfo,
    IStopPointLocations,
    IVehicleLocationList,
    IVehiclePathInfo,
    PositionType,
} from '@manniwatch/api-types';
import {
    ApiService, IBounds, TripInfoWithId,
} from '@manniwatch/client-types';
import { ipcRenderer } from 'electron';

export const manniwatchApi: ApiService = {

    getTripPassages(tripId: string, mode: string = 'departure'): Promise<TripInfoWithId> {
        return ipcRenderer.invoke('api/trip/passages', tripId, mode);
    },

    getRouteByVehicleId(vehicleId: string): Promise<IVehiclePathInfo> {
        return ipcRenderer.invoke('api/vehicle/route', vehicleId);
    },

    getRouteByTripId(tripId: string): Promise<IVehiclePathInfo> {
        return ipcRenderer.invoke('api/trip/route', tripId);
    },

    getRouteByRouteId(routeId: string, direction: string): Promise<IVehiclePathInfo> {
        return ipcRenderer.invoke('api/route/route', routeId, direction);
    },

    getStopInfo(stopId: string): Promise<IStopInfo> {
        return ipcRenderer.invoke('api/stop/info', stopId);
    },

    getStopPointInfo(stopPointId: string): Promise<IStopPointInfo> {
        return ipcRenderer.invoke('api/stopPoint/info', stopPointId);
    },

    getStopPassages(stopId: string): Promise<IStopPassage> {
        return ipcRenderer.invoke('api/stop/passages', stopId);
    },

    getStopPointPassages(stopPointId: string): Promise<IStopPassage> {
        return ipcRenderer.invoke('api/stopPoint/passages', stopPointId);
    },

    getVehicleLocations(positionType: PositionType = 'RAW', lastUpdate: number = 0): Promise<IVehicleLocationList> {
        return ipcRenderer.invoke('api/geo/vehicles', positionType, lastUpdate);
    },

    getStopLocations(bounds?: IBounds): Promise<IStopLocations> {
        return ipcRenderer.invoke('api/geo/stops', bounds);
    },

    getStopPointLocations(bounds?: IBounds): Promise<IStopPointLocations> {
        return ipcRenderer.invoke('api/geo/stopPoints', bounds);
    },

    getSettings(): Promise<ISettings> {
        return ipcRenderer.invoke('api/settings');
    },
};
