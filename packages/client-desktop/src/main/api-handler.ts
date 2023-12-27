/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import {
    ISettings,
    IStopLocations,
    IStopPassage,
    IStopPointLocations,
    ITripPassages,
    ITripRoute,
    IVehicleLocationList,
    IVehiclePathInfo,
    PositionType,
    StopMode,
} from '@manniwatch/api-types';
import { IBounds, TripInfoWithId } from '@manniwatch/client-types';
import electron from 'electron';

export const createApiHandler = (client: ManniWatchApiClient): void => {
    electron.ipcMain.handle('api/settings', (event: electron.IpcMainInvokeEvent): Promise<ISettings> => {
        return client.getSettings();
    });
    electron.ipcMain.handle('api/vehicle/route', (event: electron.IpcMainInvokeEvent, vehicleId: string): Promise<IVehiclePathInfo> => {
        return client.getRouteByVehicleId(vehicleId);
    });
    electron.ipcMain.handle('api/geo/vehicles', (event: electron.IpcMainInvokeEvent,
        positionType: PositionType,
        lastUpdate: number): Promise<IVehicleLocationList> => {
        return client.getVehicleLocations(positionType, lastUpdate);
    });
    electron.ipcMain.handle('api/geo/stops', (event: electron.IpcMainInvokeEvent,
        box: IBounds): Promise<IStopLocations> => {
        return client.getStopLocations(box);
    });
    electron.ipcMain.handle('api/geo/stopPoints', (event: electron.IpcMainInvokeEvent,
        box: IBounds): Promise<IStopPointLocations> => {
        return client.getStopPointLocations(box);
    });
    electron.ipcMain.handle('api/stop/passages', (event: electron.IpcMainInvokeEvent,
        stopId: string,
        mode: StopMode = 'departure',
        startTime?: number,
        timeFrame?: number): Promise<IStopPassage> => {
        return client.getStopPassages(stopId, mode, startTime, timeFrame);
    });
    electron.ipcMain.handle('api/stopPoint/passages', (event: electron.IpcMainInvokeEvent,
        stopId: string,
        mode: StopMode = 'departure',
        startTime?: number,
        timeFrame?: number): Promise<IStopPassage> => {
        return client.getStopPointPassages(stopId, mode, startTime, timeFrame);
    });
    electron.ipcMain.handle('api/trip/passages', (event: electron.IpcMainInvokeEvent,
        tripId: string,
        mode?: StopMode): Promise<TripInfoWithId> => {
        return client.getTripPassages(tripId, mode)
            .then((passages: ITripPassages): TripInfoWithId => Object.assign({ tripId }, passages));
    });
    electron.ipcMain.handle('api/trip/route', (event: electron.IpcMainInvokeEvent,
        tripId: string): Promise<ITripRoute> => {
        return client.getRouteByTripId(tripId);
    });
};
