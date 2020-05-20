import { ITimestampedVehicleLocation, VehicleDiffHandler } from '@manniwatch/vehicle-location-diff';
import { intervalVehicleLocationPoll, QueryFactory } from '@manniwatch/vehicle-cache';
import { Map, List } from 'immutable';
import { OperatorFunction, Observable, from, concat, of } from 'rxjs';
import { scan, catchError } from 'rxjs/operators';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { IVehicleLocationList, PositionType } from '@manniwatch/api-types';
type CurrentState = Map<string, ITimestampedVehicleLocation>;
export interface CacheState {
    currentState: CurrentState;
    lastChange: List<ITimestampedVehicleLocation>;
}
export const scanDiff = (initial?: CacheState): OperatorFunction<IVehicleLocationList, CacheState> => {
    return scan((acc: CacheState, val: IVehicleLocationList): CacheState => {
        const vehicleList: List<ITimestampedVehicleLocation> = List(VehicleDiffHandler.convert(val));
        let state: CurrentState = acc.currentState || Map();
        vehicleList.forEach((loc: ITimestampedVehicleLocation): void => {
            state = state.set(loc.id, loc);
        });
        return acc;
    }, initial as CacheState);
};

export const createVehiclePollObservable = (client: ManniWatchApiClient) => {
    const queryFac: QueryFactory = (pos: PositionType, timestamp: number): Observable<IVehicleLocationList> => {
        return from<IVehicleLocationList>(client.getVehicleLocations(pos, timestamp));
    };
    return intervalVehicleLocationPoll(queryFac, 15000)
        .pipe(catchError((err: any, caught: Observable<IVehicleLocationList>): Observable<IVehicleLocationList> => {
            return concat(of<IVehicleLocationList>(undefined as unknown as IVehicleLocationList), caught);
        }));
}
