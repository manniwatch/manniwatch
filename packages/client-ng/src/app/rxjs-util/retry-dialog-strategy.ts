/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { flatMap, map, skipWhile } from 'rxjs/operators';
import { RetryDialogComponent } from '../modules/common/retry-dialog';

export type ErrorItem = any | HttpErrorResponse;
export type CreateDialogFuncResponse = MatDialogRef<RetryDialogComponent, boolean>;
export type CreateDialogFunc = (error?: ErrorItem) => CreateDialogFuncResponse;
export type RetryDialogStrategyFuncResponse = (errors: Observable<ErrorItem>) => Observable<true>;
export type RetryDialogStrategyFunc = (createDialog: CreateDialogFunc) => RetryDialogStrategyFuncResponse;

/**
 * If an error occurs it will call the dialog and waits for its result.
 * If the result equals true the stream will be retried
 * @param createDialog a method that returns valid Dialog
 */
export const retryDialogStrategy: RetryDialogStrategyFunc = (createDialog: CreateDialogFunc): RetryDialogStrategyFuncResponse =>
    (errors: Observable<ErrorItem>): Observable<true> => {
        let dialogOpen: boolean = false;
        return errors.pipe(skipWhile((): boolean => dialogOpen),
            flatMap((error: ErrorItem): Observable<true> => {
                dialogOpen = true;
                const dialogRef: CreateDialogFuncResponse = createDialog(error);
                return dialogRef.afterClosed()
                    .pipe(map((tapedValue: boolean): true => {
                        dialogOpen = false;
                        if (!tapedValue) {
                            /**
                             * Rethrow error if dialog was dismissed
                             */
                            throw error;
                        }
                        /**
                         * Retry the preceeding stream
                         */
                        return true;
                    }));
            }));
    };
