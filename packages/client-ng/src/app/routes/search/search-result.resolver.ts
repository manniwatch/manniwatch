/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IStopLocation } from '@manniwatch/api-types';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StopPointService } from 'src/app/services/stop-point.service';

@Injectable()
export class SearchResultResolver implements Resolve<IStopLocation[]> {
    public constructor(private stopService: StopPointService) {}
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopLocation[]> {
        return this.stopService.stopObservable.pipe(
            take(1),
            map((stops: IStopLocation[]): IStopLocation[] =>
                stops
                    /**
                     * Filter by search term
                     */
                    .filter((option: IStopLocation): boolean => option.name.toLowerCase().includes(route.queryParams.q as string))
                    .sort((a: IStopLocation, b: IStopLocation): number => a.name.localeCompare(b.name))
            )
        );
    }
}
