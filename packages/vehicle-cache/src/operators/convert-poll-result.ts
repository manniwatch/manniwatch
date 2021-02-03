/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { IVehicleLocationList } from '@manniwatch/api-types';
import { of, Observable, OperatorFunction } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export enum PollResultStats {
    SUCCESS = 'success',
    TIMEOUT = 'timeout',
    ERROR = 'error',
}
export type PollResult = {
    type: PollResultStats.SUCCESS,
    result: IVehicleLocationList,
} | {
    type: PollResultStats.ERROR,
    error: any,
};

export const convertPollResult = (): OperatorFunction<IVehicleLocationList, PollResult> => {
    return (source: Observable<IVehicleLocationList>): Observable<PollResult> => {
        return source
            .pipe(map((inputList: IVehicleLocationList): PollResult => {
                return {
                    result: inputList,
                    type: PollResultStats.SUCCESS,
                };
            }), catchError((error: any): Observable<PollResult> => {
                return of({
                    error,
                    type: PollResultStats.ERROR,
                });
            }));
    };
};
