import { ManniWatchApiClient } from "@manniwatch/api-client";
import { IVehicleLocationList, PositionType } from "@manniwatch/api-types";
import { concat, Observable, of, Subject, Subscriber, Subscription } from "rxjs";
import { delay, switchMap, tap } from "rxjs/operators";
import { convertPollResult, PollResult, } from "../operators";

export interface IPollSettings {
    client: ManniWatchApiClient,
    type?: PositionType,
    refreshInterval?: number
}

export type QueryFactory = (lastUpdate: number) => Observable<IVehicleLocationList>;
export const intervallPollVehicles = (queryFactory: QueryFactory, refreshInterval: number = 60000): Observable<PollResult> => {
    return new Observable<PollResult>((subscriber: Subscriber<PollResult>): Subscription => {
        const updateSubject: Subject<number> = new Subject<number>();
        return concat(of(0), updateSubject.pipe(delay(refreshInterval)))
            .pipe(switchMap((timestamp: number): Observable<PollResult> => {
                let lastUpdate: number = timestamp;
                return queryFactory(timestamp)
                    .pipe(tap({
                        next: (locs: IVehicleLocationList): void => {
                            lastUpdate = locs.lastUpdate;
                        },
                        error: (): void => {
                            updateSubject.next(lastUpdate);
                        },
                        complete: (): void => {
                            updateSubject.next(lastUpdate);
                        }
                    }), convertPollResult());
            }))
            .subscribe(subscriber);
    });
}