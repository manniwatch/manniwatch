/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { IStopLocations } from '@manniwatch/api-types';
import { throwError, EMPTY, Observable } from 'rxjs';
import { catchError, retryWhen } from 'rxjs/operators';
import { RetryDialogComponent } from 'src/app/modules/common/retry-dialog';
import { CreateDialogFuncResponse, retryDialogStrategy } from 'src/app/rxjs-util';
import { ApiService } from 'src/app/services';

/**
 * A Resolver for the Stations Response
 */
@Injectable()
export class StopsResolver implements Resolve<IStopLocations> {

    /**
     * Constructor
     *
     * @param api the {@ApiService}
     * @param router
     * @param dialog
     */
    public constructor(private api: ApiService,
        private router: Router,
        private dialog: MatDialog) { }

    /**
     * Resolves the station response
     *
     * @param route The activated RouteSnapshot
     * @param state The router state snapshot
     * @returns An observable that resolves the {@StationsResponse}
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopLocations> {
        return this.api
            .getStopLocations()
            .pipe(catchError((err: any | HttpErrorResponse): Observable<IStopLocations> => {
                if (err instanceof HttpErrorResponse && err.status === 404) {
                    void this.router.navigate(['error', 'not-found']);
                    return EMPTY;
                }
                return throwError((): any | HttpErrorResponse => err);
            }),
                retryWhen(retryDialogStrategy((error: any | HttpErrorResponse): CreateDialogFuncResponse => {
                    const code: number | undefined = (error instanceof HttpErrorResponse) ? error.status : undefined;
                    this.dialog.open(RetryDialogComponent, {
                        data: {
                            code,
                            message: 'test',
                        },
                    })
                })));
    }
}
