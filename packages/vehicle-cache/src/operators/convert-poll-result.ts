
import { IVehicleLocationList } from "@manniwatch/api-types";
import { Observable, of, OperatorFunction } from "rxjs";
import { catchError, map } from "rxjs/operators";

export enum PollResultStats {
    SUCCESS = "success",
    TIMEOUT = "timeout",
    ERROR = "error"
}
export type PollResult = {
    type: PollResultStats.SUCCESS,
    result: IVehicleLocationList
} | {
    type: PollResultStats.ERROR,
    error: any,
};

export const convertPollResult = (): OperatorFunction<IVehicleLocationList, PollResult> => {
    return (source: Observable<IVehicleLocationList>): Observable<PollResult> => {
        return source
            .pipe(map((inputList: IVehicleLocationList): PollResult => {
                return {
                    type: PollResultStats.SUCCESS,
                    result: inputList,
                }
            }), catchError((error: any): Observable<PollResult> => {
                return of({
                    type: PollResultStats.ERROR,
                    error,
                });
            }));
    };
}