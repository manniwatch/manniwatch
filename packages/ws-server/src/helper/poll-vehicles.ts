import { from, NEVER, Observable, of, OperatorFunction } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { ManniWatchApiClient } from "@manniwatch/api-client";
import { IPollError, IPollResponse, PollResult, PollResultStatus } from "./types";
import { IVehicleLocationList, PositionType } from "@manniwatch/api-types";

export const pollVehicles = (client: ManniWatchApiClient, positionType: PositionType = 'RAW'): OperatorFunction<number, PollResult> => {
    return (source: Observable<number>): Observable<PollResult> => {
        return source.pipe(mergeMap((lastUpdate: number): Observable<PollResult> => {
            return from(client.getVehicleLocations(positionType, lastUpdate))
                .pipe(map((response: IVehicleLocationList): IPollResponse => {
                    return {
                        status: PollResultStatus.SUCCESS,
                        result: response,
                    }
                }), catchError((err: any): Observable<IPollError> => {
                    return of({
                        status: PollResultStatus.ERROR,
                        error: err,
                    });
                }))
        }));
    };
}