/*!
 * Source https://github.com/manniwatch/manniwatch Package: @manniwatch/ws-server
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { IVehicleLocationList, PositionType } from '@manniwatch/api-types';
import { intervalVehicleLocationPoll, QueryFactory } from '@manniwatch/vehicle-cache';
import { ITimestampedVehicleLocation, VehicleDiffHandler } from '@manniwatch/vehicle-location-diff';
import { Observable, from, concat, of, timer, Observer, Subscription } from 'rxjs';
import { scan, catchError, map, first, flatMap } from 'rxjs/operators';
import { CacheMessage, CacheMessageType, ICacheState } from './cache-message';
type PollUpdate = {
    type: CacheMessageType.UPDATE;
    locations: IVehicleLocationList;
} | {
    error: any;
    type: CacheMessageType.ERROR;
};
export const createEndlessPollObservable = (client: ManniWatchApiClient, pollInterval: number): Observable<PollUpdate> => {
    const queryFac: QueryFactory = (pos: PositionType, timestamp: number): Observable<IVehicleLocationList> => {
        return from(client.getVehicleLocations(pos, timestamp) as Promise<IVehicleLocationList>);
    };
    return intervalVehicleLocationPoll(queryFac, pollInterval)
        .pipe(map((veh: IVehicleLocationList): PollUpdate => {
            return {
                locations: veh,
                type: CacheMessageType.UPDATE,
            };
        }), catchError((err: any, caught: Observable<PollUpdate>): Observable<PollUpdate> => {
            const errorMessage: PollUpdate = {
                error: err,
                type: CacheMessageType.ERROR,
            };
            const delayedRetry: Observable<PollUpdate> = timer(pollInterval).pipe(first(), flatMap((): Observable<PollUpdate> => caught));
            return concat(of<PollUpdate>(errorMessage), delayedRetry);
        }));
}
export const generateState = (oldState: ICacheState, updates: ITimestampedVehicleLocation[]): ICacheState => {
    return updates.reduce((prev: ICacheState, cur: ITimestampedVehicleLocation): ICacheState => {
        if (!(cur.id in oldState)) {
            prev[cur.id] = cur;
        } else if (prev[cur.id].lastUpdate <= cur.lastUpdate) {
            prev[cur.id] = cur;
        }
        return prev;
    }, oldState);
}
export const createVehicleUpdateStream = (source: Observable<PollUpdate>): Observable<CacheMessage> => {
    return new Observable((observer: Observer<CacheMessage>): Subscription => {
        return source.pipe(scan((acc: CacheMessage, val: PollUpdate, idx: number): CacheMessage => {
            if (val.type === CacheMessageType.UPDATE) {
                const changeList: ITimestampedVehicleLocation[] = VehicleDiffHandler.convert(val.locations);
                const newState: ICacheState = generateState(acc.state, changeList);
                return {
                    diff: changeList,
                    lastUpdate: val.locations.lastUpdate,
                    state: newState,
                    type: CacheMessageType.UPDATE,
                }
            }
            return {
                error: val.error,
                lastUpdate: acc.lastUpdate,
                state: acc.state,
                type: CacheMessageType.ERROR,
            };
        })).subscribe(observer);
    });
};
