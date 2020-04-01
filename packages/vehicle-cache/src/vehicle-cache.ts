/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { ManniWatchApiClient, PositionType } from '@manniwatch/api-client';
import { IVehicleLocationList } from '@manniwatch/api-types';
import { defer, from, of, BehaviorSubject, Observable } from 'rxjs';
import { concatMap, delay, retryWhen, share, switchMap, tap } from 'rxjs/operators';
export class VehicleCache {
    public constructor(public client: ManniWatchApiClient,
        public readonly queryDelay: number = 15000,
        public readonly positionType: PositionType = 'RAW') {

    }
    private lastUpdateSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    public polling: boolean = true;
    public safeQueryData(lastUpdate: number): Observable<IVehicleLocationList> {
        const networkRequest: Observable<IVehicleLocationList> = defer((): Observable<IVehicleLocationList> => {
            return from(this.client.getVehicleLocations(this.positionType, lastUpdate));
        });
        return networkRequest
            .pipe(retryWhen((errors: Observable<any>): Observable<any> => {
                return errors.pipe(delay(this.queryDelay * 2));
            }));
    }

    public createPollingObservable(): Observable<IVehicleLocationList> {
        return this.lastUpdateSubject.pipe(
            concatMap((lastUpdate: number, index: number): Observable<number> => {
                if (index < 1) {
                    return of(lastUpdate);
                } else {
                    return of(lastUpdate).pipe(delay(this.queryDelay));
                }
            }),
            switchMap((lastUpdate: number): Observable<IVehicleLocationList> => this.safeQueryData(lastUpdate)),
            tap((response: IVehicleLocationList): void => this.lastUpdateSubject.next(response.lastUpdate)),
            share());
    }

    public start(): void {

    }

    public stop(): void {

    }

}
