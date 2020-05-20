import { ITimestampedVehicleLocation, VehicleDiffHandler } from '@manniwatch/vehicle-location-diff';
import { Map, List } from 'immutable';
import { IVehicleLocationList } from '../../api-types/dist';
import { OperatorFunction } from 'rxjs';
import { scan } from 'rxjs/operators';
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
