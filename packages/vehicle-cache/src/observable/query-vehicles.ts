import { ManniWatchApiClient } from "@manniwatch/api-client";
import { IVehicleLocationList, PositionType } from "@manniwatch/api-types";
import { from, Observable, } from "rxjs";

export const queryVehicles = (client: ManniWatchApiClient,
    type?: PositionType,
    lastUpdate?: number): Observable<IVehicleLocationList> => {
    return from(client.getVehicleLocations(type || 'RAW', lastUpdate || 0));
};