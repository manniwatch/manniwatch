/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { IStopPassage } from '@manniwatch/api-types';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/services';

/**
 * Resolves information for a stop provided in the route parameter 'stopId'
 * Redirects to /stops if the server responds with an 404 status
 */
@Injectable()
export class StopInfoResolver implements Resolve<IStopPassage> {

    /**
     * Constructor
     *
     * @param api the {@ApiService}
     * @param router the {@Router}
     */
    public constructor(private api: ApiService, private router: Router) { }

    /**
     * Resolves the stop information via the stopId param inside the route
     *
     * @param route The RouteSnapshot
     * @param state The RouterState
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopPassage> {
        return this.api
            .getStopPassages(route.params.stopId as string)
            .pipe(catchError((err: any | HttpErrorResponse): Observable<never> => {
                if (err instanceof HttpErrorResponse && err.status === 404) {
                    void this.router.navigate(['stops']);
                }
                return EMPTY;
            }));
    }
}
