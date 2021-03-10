import { ManniWatchApiClient } from '@manniwatch/api-client';
import { ISettings, IVehicleLocationList, IVehiclePathInfo, PositionType } from '@manniwatch/api-types';
import { ipcMain, IpcMainInvokeEvent } from "electron";

export const createApiHandler = (client: ManniWatchApiClient): void => {
    ipcMain.handle('api/settings', (event: IpcMainInvokeEvent): Promise<ISettings> => {
        return client.getSettings();
    });
    ipcMain.handle('api/vehicle/route', (event: IpcMainInvokeEvent, vehicleId): Promise<IVehiclePathInfo> => {
        return client.getRouteByVehicleId(vehicleId);
    });
    ipcMain.handle('api/geo/vehicles', (event: IpcMainInvokeEvent,
        positionType: PositionType,
        lastUpdate: number): Promise<IVehicleLocationList> => {
        return client.getVehicleLocations(positionType, lastUpdate);
    });
}
