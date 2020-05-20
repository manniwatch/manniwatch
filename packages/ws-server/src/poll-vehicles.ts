import { ITimestampedVehicleLocation, VehicleDiffHandler } from '@manniwatch/vehicle-location-diff';
import { intervalVehicleLocationPoll, QueryFactory } from '@manniwatch/vehicle-cache';
import { Map, List } from 'immutable';
import { OperatorFunction, Observable, from, concat, of } from 'rxjs';
import { scan, catchError, map } from 'rxjs/operators';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { IVehicleLocationList, PositionType } from '@manniwatch/api-types';
import { CacheMessage, CacheMessageType, IErrorCacheMessage } from './cache-message';
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

export const createVehiclePollObservable = (client: ManniWatchApiClient): Observable<CacheMessage> => {
    const queryFac: QueryFactory = (pos: PositionType, timestamp: number): Observable<IVehicleLocationList> => {
        return from(client.getVehicleLocations(pos, timestamp));
    };
    return intervalVehicleLocationPoll(queryFac, 15000)
        .pipe(map((veh: IVehicleLocationList): CacheMessage => {
            return {
                diff: undefined,
                lastUpdate: veh.lastUpdate,
                state: undefined,
                type: CacheMessageType.UPDATE,
            };
        }), catchError((err: any, caught: Observable<CacheMessage>): Observable<CacheMessage> => {
            return concat(of<CacheMessage>({
                lastUpdate: veh.lastUpdate,
                state: undefined,
                type: CacheMessageType.ERROR,
            }), caught);
        }));
}
