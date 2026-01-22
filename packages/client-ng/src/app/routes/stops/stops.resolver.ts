/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { IStopLocations } from '@manniwatch/api-types';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { AppDialogService } from 'src/app/services';
import { RetryResolver } from 'src/app/util/retry-resolver';

/**
 * A Resolver for the Stations Response
 */
@Injectable()
export class StopsResolver extends RetryResolver<IStopLocations> {
    public api: ApiService = inject(ApiService);

    /**
     * Resolves the station response
     * @param route The activated RouteSnapshot
     * @param state The router state snapshot
     * @returns An observable that resolves the {@StationsResponse}
     */
    public createLoader(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopLocations> {
        return this.api.getStopLocations();
    }
}
