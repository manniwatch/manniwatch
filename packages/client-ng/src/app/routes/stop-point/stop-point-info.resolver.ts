/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { IStopPassage } from '@manniwatch/api-types';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { AppDialogService } from 'src/app/services';
import { RetryResolver } from 'src/app/util/retry-resolver';

/**
 * Resolves information for a stop provided in the route parameter 'stopId'
 * Redirects to /stops if the server responds with an 404 status
 */
@Injectable()
export class StopPointInfoResolver extends RetryResolver<IStopPassage> {
    public constructor(
        public api: ApiService,
        router: Router,
        dialog: AppDialogService
    ) {
        super(router, dialog);
    }

    public createLoader(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopPassage> {
        return this.api.getStopPointPassages(route.params.stopPointId as string);
    }
}
