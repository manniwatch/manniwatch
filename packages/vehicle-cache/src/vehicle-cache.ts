/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import * as NodeCache from 'node-cache';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { CacheEntry } from './types';

export enum CacheEventType {
    DELETE = 'delete',
    UPDATE = 'update',
}
export interface ICacheEvent {
    type: CacheEventType;
    location?: CacheEntry;
}

type ModifiedCacheOptions = Omit<NodeCache.Options, 'enableLegacyCallbacks'>;

export class VehicleCache {
    private readonly nodeCache: NodeCache;
    private readonly eventSubject: Subject<ICacheEvent>;
    public readonly eventObservable: Observable<ICacheEvent>;
    private isClosed: boolean = false;
    public constructor(opts?: ModifiedCacheOptions) {
        this.nodeCache = new NodeCache(opts);
        this.eventSubject = new Subject();
        this.eventObservable = this.eventSubject
            .pipe(share());
        this.nodeCache.on('set', (key: string, value: CacheEntry): void => {
            this.eventSubject.next({
                location: value,
                type: CacheEventType.UPDATE,
            });
        });
        this.nodeCache.on('del', (key: string, value: CacheEntry): void => {
            this.eventSubject.next({
                location: value,
                type: CacheEventType.DELETE,
            });
        });
    }

    private assertClosed(): void {
        if (this.isClosed) {
            throw new Error('The cache has been closed');
        }
    }

    public update(location: CacheEntry): void {
        this.assertClosed();
        if (location.isDeleted === true) {
            this.nodeCache.del(location.id);
        } else {
            this.nodeCache.set(location.id, location);
        }
    }

    public updateMultiple(locations: CacheEntry[]): void {
        this.assertClosed();
        const deletedLocations: CacheEntry[] = [];
        const updateLocations: CacheEntry[] = [];
        locations.forEach((location: CacheEntry): void => {
            if (location.isDeleted === true) {
                deletedLocations.push(location);
            } else {
                updateLocations.push(location);
            }
        });
        this.nodeCache.mset(updateLocations
            .map((loc: CacheEntry): NodeCache.ValueSetItem<CacheEntry> => {
                return {
                    key: loc.id,
                    val: loc,
                };
            }));
        this.nodeCache.del(deletedLocations
            .map((loc: CacheEntry): string => loc.id));
    }

    public getState(): CacheEntry[] {
        this.assertClosed();
        const vehicles: { [key: string]: CacheEntry } = this.
            nodeCache.mget<CacheEntry>(this.nodeCache.keys());
        return Object.entries(vehicles)
            .map((vehicle: [string, CacheEntry]): CacheEntry => vehicle[1]);
    }

    public close(): void {
        this.nodeCache.close();
        this.eventSubject.complete();
        this.isClosed = true;
    }
}
