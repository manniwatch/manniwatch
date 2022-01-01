/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { Injectable } from '@angular/core';
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
    /**
     * Constructor
     *
     * @param api the {@ApiService}
     * @param router
     * @param dialog
     */
    public constructor(public api: ApiService, router: Router, dialog: AppDialogService) {
        super(router, dialog);
    }

    /**
     * Resolves the station response
     *
     * @param route The activated RouteSnapshot
     * @param state The router state snapshot
     * @returns An observable that resolves the {@StationsResponse}
     */
    public createLoader(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopLocations> {
        return this.api.getStopLocations();
    }
}
