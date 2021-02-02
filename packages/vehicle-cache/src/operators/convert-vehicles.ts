/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { IVehicleLocationList } from '@manniwatch/api-types';
import { convertVehicleLocations } from '@manniwatch/pb-converter';
import { manniwatch as mannitypes } from '@manniwatch/pb-types';
import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export const convertVehicles = (): OperatorFunction<IVehicleLocationList, mannitypes.IVehicleLocationList> => {
    return (source: Observable<IVehicleLocationList>): Observable<mannitypes.IVehicleLocationList> => {
        return source
            .pipe(map((inputList: IVehicleLocationList): mannitypes.IVehicleLocationList => {
                return convertVehicleLocations(inputList);
            }));
    };
};
