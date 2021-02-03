/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { MonoTypeOperatorFunction, Observable, Subscriber, TeardownLogic } from 'rxjs';
import { CacheEntry } from '../types';

/**
 * Operator keeping a cache and only emitting distinct and or new CacheEntries
 * Not using distinctUntilChanged as the hashmap is faster
 */
export const vehicleCacheOperator = (): MonoTypeOperatorFunction<CacheEntry> => {
    return (source: Observable<CacheEntry>): Observable<CacheEntry> => {
        const cacheMap: Map<string, CacheEntry> = new Map();
        return new Observable<CacheEntry>((subscriber: Subscriber<CacheEntry>): TeardownLogic => {
            return source.pipe()
                .subscribe({
                    complete: (): void => {
                        cacheMap.clear();
                        subscriber.complete();
                    },
                    error: (err: any): void => {
                        cacheMap.clear();
                        subscriber.error(err);
                    },
                    next: (sourceEntry: CacheEntry): void => {
                        const cacheEntry: CacheEntry | undefined = cacheMap.get(sourceEntry.id);
                        // tslint:disable-next-line:triple-equals
                        if (cacheEntry == undefined) {
                            cacheMap.set(sourceEntry.id, sourceEntry);
                            subscriber.next(sourceEntry);
                            return;
                        }
                        if (cacheEntry.lastUpdate >= sourceEntry.lastUpdate) {
                            return;
                        }
                        cacheMap.set(sourceEntry.id, sourceEntry);
                        if (sourceEntry.isDeleted === true && cacheEntry.isDeleted === true) {
                            return;
                        }
                        subscriber.next(sourceEntry);
                    },
                });
        });
    };
};
