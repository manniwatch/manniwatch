/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { NgZone } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subscriber, Subscription } from 'rxjs';

export const runInsideZone: <T>(zone: NgZone) => MonoTypeOperatorFunction<T> =
    <T>(zone: NgZone): MonoTypeOperatorFunction<T> =>
        (source: Observable<T>): Observable<T> =>
            new Observable<T>((observer: Subscriber<T>): Subscription =>
                source.subscribe({
                    next(x: T): void {
                        if (NgZone.isInAngularZone()) {
                            observer.next(x);
                        } else {
                            zone.run((): void => {
                                observer.next(x);
                            });
                        }
                    },
                    error(err: any): void { observer.error(err); },
                    complete(): void { observer.complete(); },
                }));
