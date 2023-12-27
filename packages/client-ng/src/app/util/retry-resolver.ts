/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, from, mergeMap, Observable, of, retryWhen, throwError } from 'rxjs';
import { AppDialogService } from '../services';

export type ErrorTypes = Error | HttpErrorResponse;
export abstract class RetryResolver<T> implements Resolve<T> {
    public constructor(
        public router: Router,
        public dialog: AppDialogService
    ) {}
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
        return this.createLoader(route, state).pipe(
            retryWhen((obs: Observable<ErrorTypes>): Observable<boolean> => {
                return obs.pipe(
                    mergeMap((err: ErrorTypes) => {
                        if (err instanceof HttpErrorResponse) {
                            if (err.status === 404) {
                                return this.navigate(['error', 'not-found']).pipe(
                                    mergeMap((navigated: boolean): Observable<never> => {
                                        return EMPTY;
                                    })
                                );
                            } else if (err.status >= 500 && err.status < 600) {
                                return this.dialog
                                    .getRetryDialog({
                                        msg: 'Error',
                                    })
                                    .pipe(
                                        mergeMap((it: boolean): Observable<true> => {
                                            return it ? of(it) : throwError((): ErrorTypes => err);
                                        })
                                    );
                            }
                        }
                        return throwError((): ErrorTypes => err);
                    })
                );
            })
        );
    }

    public navigate(...args: Parameters<Router['navigate']>): Observable<boolean> {
        return from(this.router.navigate(...args));
    }

    public abstract createLoader(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T>;
}
