/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { ManniWatchApiClient, PositionType } from '@manniwatch/api-client';
import { IVehicleLocationList } from '@manniwatch/api-types';
import { IVehicleLocationDiff, VehicleDiffHandler } from '@manniwatch/vehicle-location-diff';
import { defer, from, EMPTY, Observable } from 'rxjs';
import { catchError, scan, shareReplay } from 'rxjs/operators';
import { intervalPoll } from './interval-poll';
export class VehicleCache {
    public constructor(public client: ManniWatchApiClient,
        public readonly queryDelay: number = 15000,
        public readonly positionType: PositionType = 'RAW') {

    }
    public polling: boolean = true;
    public safeQueryData(lastUpdate: number): Observable<IVehicleLocationList> {
        const networkRequest: Observable<IVehicleLocationList> = defer((): Observable<IVehicleLocationList> => {
            return from(this.client.getVehicleLocations(this.positionType, lastUpdate));
        });
        return networkRequest
            .pipe(catchError((): Observable<any> => {
                return EMPTY;
            }));
    }

    public createSharedPollingObservable(): Observable<IVehicleLocationDiff> {
        return intervalPoll((lastUpdate: number): Observable<IVehicleLocationList> => {
            return this.safeQueryData(lastUpdate);
        })
            .pipe(scan((acc: IVehicleLocationDiff, val: IVehicleLocationList, idx: number): IVehicleLocationDiff => {
                return VehicleDiffHandler.diff(acc, VehicleDiffHandler.convert(val));
            }), shareReplay({ refCount: true, bufferSize: 1 }));
    }

    public start(): void {
    }

    public stop(): void {

    }

}
