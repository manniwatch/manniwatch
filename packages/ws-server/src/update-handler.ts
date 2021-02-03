import { from, NEVER, Observable, OperatorFunction } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";
import { ManniWatchApiClient } from "@manniwatch/api-client";

export const kk = <T>(client: ManniWatchApiClient): OperatorFunction<T, any> => {
    return (source: Observable<T>): Observable<any> => {
        return source.pipe(mergeMap((key: T) => {
            return from(client.getVehicleLocations('RAW'))
                .pipe(catchError((err): Observable<any> => {
                    return NEVER;
                }))
        }));
    };
}