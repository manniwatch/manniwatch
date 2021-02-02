/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { IVehicleLocationList } from '@manniwatch/api-types';
import { from, Observable, OperatorFunction } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IQuerySettings } from '../types';

export const queryVehiclesOperator = (client: ManniWatchApiClient): OperatorFunction<IQuerySettings, IVehicleLocationList> => {
    return (source: Observable<IQuerySettings>): Observable<IVehicleLocationList> => {
        return source
            .pipe(mergeMap((settings: IQuerySettings): Observable<IVehicleLocationList> => {
                return from(client.getVehicleLocations(settings.type || 'RAW', settings.lastUpdate || 0));
            }));
    };
};
