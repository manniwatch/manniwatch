/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { HttpErrorResponse } from '@angular/common/http';
import { TripInfoWithId } from '@manniwatch/client-types';
import { of, Observable, OperatorFunction } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export enum UpdateStatus {
    LOADING = 1,
    LOADED = 2,
    ERROR = 3,
    PAUSED = 4,
    UNKNOWN = 5,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
}

export interface IPassageStatus {
    status?: UpdateStatus;
    tripInfo?: TripInfoWithId;
    timestamp: number;
    failures: number;
    tripId: string;
}

export class TripPassagesUtil {
    public static convertResponse(tripId: string): OperatorFunction<TripInfoWithId, IPassageStatus> {
        return map((tripPassages: TripInfoWithId): IPassageStatus =>
        ({
            failures: 0,
            status: UpdateStatus.LOADED,
            timestamp: Date.now(),
            tripId: tripPassages.tripId,
            tripInfo: tripPassages,
        }));
    }
    public static handleError(tripId: string): OperatorFunction<any, IPassageStatus> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return catchError((err: any | HttpErrorResponse): Observable<IPassageStatus> => {
            if (typeof err?.status === 'number') {
                return of({
                    failures: 1,
                    passages: undefined,
                    status: (err.status >= 500 && err.status < 600) ? UpdateStatus.SERVER_ERROR : err.status,
                    timestamp: Date.now(),
                    tripId,
                });
            } else {
                return of({
                    failures: 1,
                    passages: undefined,
                    status: UpdateStatus.ERROR,
                    timestamp: Date.now(),
                    tripId,
                });
            }
        });
    }
}
