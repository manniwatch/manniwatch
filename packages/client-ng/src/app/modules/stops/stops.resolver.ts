/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { IStopLocations } from '@manniwatch/api-types';
import { throwError, EMPTY, Observable } from 'rxjs';
import { catchError, retryWhen } from 'rxjs/operators';
import { retryDialogStrategy } from 'src/app/rxjs-util';
import { ApiService } from '../../services';
import { RetryDialogComponent } from '../common/retry-dialog';

/**
 * A Resolver for the Stations Response
 */
@Injectable()
export class StopsResolver implements Resolve<IStopLocations> {

    /**
     * Constructor
     * @param api the {@ApiService}
     */
    public constructor(private api: ApiService,
                       private router: Router,
                       private dialog: MatDialog) { }

    /**
     * Resolves the station response
     * @param route The activated RouteSnapshot
     * @param state The router state snapshot
     * @returns An observable that resolves the {@StationsResponse}
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopLocations> {
        return this.api
            .getStopLocations()
            .pipe(catchError((err: any | HttpErrorResponse): Observable<IStopLocations> => {
                if (err.status === 404) {
                    this.router.navigate(['error', 'not-found']);
                    return EMPTY;
                } else {
                    return throwError(err);
                }
            }),
                retryWhen(retryDialogStrategy((error: any | HttpErrorResponse) =>
                    this.dialog.open(RetryDialogComponent, {
                        data: {
                            code: error.status ? error.status : undefined,
                            message: 'test',
                        },
                    }))));
    }
}
