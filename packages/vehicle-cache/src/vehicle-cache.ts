/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { ManniWatchApiClient, PositionType } from '@manniwatch/api-client';
import { IVehicleLocationList } from '@manniwatch/api-types';
import { defer, from, EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

    public start(): void {

    }

    public stop(): void {

    }

}
