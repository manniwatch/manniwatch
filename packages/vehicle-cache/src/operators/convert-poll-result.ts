/*
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { IVehicleLocationList } from '@manniwatch/api-types';
import { of, Observable, OperatorFunction } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export enum PollResultStatus {
    SUCCESS = 'success',
    TIMEOUT = 'timeout',
    ERROR = 'error',
}
export type PollResult =
    | {
          type: PollResultStatus.SUCCESS;
          result: IVehicleLocationList;
      }
    | {
          type: PollResultStatus.ERROR;
          error: unknown;
      };

export const convertPollResult = (): OperatorFunction<IVehicleLocationList, PollResult> => {
    return (source: Observable<IVehicleLocationList>): Observable<PollResult> => {
        return source.pipe(
            map((inputList: IVehicleLocationList): PollResult => {
                return {
                    result: inputList,
                    type: PollResultStatus.SUCCESS,
                };
            }),
            catchError((error: unknown): Observable<PollResult> => {
                return of({
                    error,
                    type: PollResultStatus.ERROR,
                });
            })
        );
    };
};
