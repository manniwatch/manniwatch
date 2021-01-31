import { ManniWatchApiClient } from "@manniwatch/api-client";
import { IVehicleLocationList, PositionType } from "@manniwatch/api-types";
import { from, Observable, OperatorFunction } from "rxjs";
import { mergeMap } from "rxjs/operators";

export interface IQuerySettings {
    type?: PositionType,
    lastUpdate?: number,
}
export const queryVehicles = (client: ManniWatchApiClient): OperatorFunction<IQuerySettings, IVehicleLocationList> => {
    return (source: Observable<IQuerySettings>): Observable<IVehicleLocationList> => {
        return source
            .pipe(mergeMap((settings: IQuerySettings): Observable<IVehicleLocationList> => {
                return from(client.getVehicleLocations(settings.type || 'RAW', settings.lastUpdate || 0));
            }));
    };
}