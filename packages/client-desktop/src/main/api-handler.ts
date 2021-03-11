/*!
 * Source https://github.com/manniwatch/manniwatch
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
import { ipcMain, IpcMainInvokeEvent } from 'electron';

export const createApiHandler = (client: ManniWatchApiClient): void => {
    ipcMain.handle('api/settings', (event: IpcMainInvokeEvent): Promise<ISettings> => {
        return client.getSettings();
    });
    ipcMain.handle('api/vehicle/route', (event: IpcMainInvokeEvent, vehicleId: string): Promise<IVehiclePathInfo> => {
        return client.getRouteByVehicleId(vehicleId);
    });
    ipcMain.handle('api/geo/vehicles', (event: IpcMainInvokeEvent,
        positionType: PositionType,
        lastUpdate: number): Promise<IVehicleLocationList> => {
        return client.getVehicleLocations(positionType, lastUpdate);
    });
    ipcMain.handle('api/geo/stops', (event: IpcMainInvokeEvent,
        box: IBounds): Promise<IStopLocations> => {
        return client.getStopLocations(box);
    });
    ipcMain.handle('api/geo/stopPoints', (event: IpcMainInvokeEvent,
        box: IBounds): Promise<IStopPointLocations> => {
        return client.getStopPointLocations(box);
    });
    ipcMain.handle('api/stop/passages', (event: IpcMainInvokeEvent,
        stopId: string,
        mode: StopMode = 'departure',
        startTime?: number,
        timeFrame?: number): Promise<IStopPassage> => {
        return client.getStopPassages(stopId, mode, startTime, timeFrame);
    });
    ipcMain.handle('api/stopPoint/passages', (event: IpcMainInvokeEvent,
        stopId: string,
        mode: StopMode = 'departure',
        startTime?: number,
        timeFrame?: number): Promise<IStopPassage> => {
        return client.getStopPointPassages(stopId, mode, startTime, timeFrame);
    });
    ipcMain.handle('api/trip/passages', (event: IpcMainInvokeEvent,
        tripId: string,
        mode?: StopMode): Promise<TripInfoWithId> => {
        return client.getTripPassages(tripId, mode)
            .then((passages: ITripPassages): TripInfoWithId => Object.assign({ tripId }, passages));
    });
    ipcMain.handle('api/trip/route', (event: IpcMainInvokeEvent,
        tripId: string): Promise<ITripRoute> => {
        return client.getRouteByTripId(tripId);
    });
};
