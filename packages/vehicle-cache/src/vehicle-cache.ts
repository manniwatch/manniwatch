/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { IVehicleLocation, IVehicleLocationList } from '@manniwatch/api-types';
import { defer, from, of, BehaviorSubject, Observable } from 'rxjs';
import { concatMap, delay, retryWhen, share, switchMap, tap } from 'rxjs/operators';
export class VehicleCache {
    public constructor(public client: ManniWatchApiClient, public readonly queryDelay: number = 15000) {

    }
    private lastUpdateSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    public polling: boolean = true;
    public getVehicle(id: string): IVehicleLocation {
        return undefined as any;
    }

    public watch(cb: IVehicleLocation): void {
    }

    public safeQueryData(lastUpdate: number): Observable<IVehicleLocationList> {
        const networkRequest: Observable<IVehicleLocationList> = defer((): Observable<IVehicleLocationList> => {
            return from(this.client.getVehicleLocations('RAW', lastUpdate));
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

}
