/*!
 * Source https://github.com/manniwatch/manniwatch Package: trapeze-api-proxy-router
 */

import { TrapezeApiClient } from '@manniwatch/api-client';
import { trapeze } from '@manniwatch/trapeze-api-protobuf';
import { IVehicleLocationList } from '@manniwatch/api-types';
import { defer, from, of, BehaviorSubject, Observable } from 'rxjs';
import { concatMap, delay, retryWhen, share, switchMap, tap } from 'rxjs/operators';
export class TrapezeVehicleCache {
    public constructor(public client: TrapezeApiClient, public readonly queryDelay: number = 15000) {

    }
    private lastUpdateSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    public polling: boolean = true;
    public getVehicle(id: string): trapeze.VehicleLocation {
        return trapeze.VehicleLocation.create({
            id: 'I',
            isDeleted: false,
            lastUpdate: 29,
        });
    }

    public watch(cb: trapeze.VehicleLocation): void {
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
