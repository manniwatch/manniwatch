/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-cache
 */

import { manniwatch as mannitypes } from '@manniwatch/pb-types';
import * as NodeCache from 'node-cache';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

export enum CacheEventType {
    DELETE = 'delete',
    UPDATE = 'update',
}
export interface ICacheEvent {
    key: string;
    type: CacheEventType;
    location?: mannitypes.IVehicleLocation;
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
        this.nodeCache.on('set', (key: string, value: mannitypes.IVehicleLocation): void => {
            this.eventSubject.next({
                key,
                location: value,
                type: CacheEventType.UPDATE,
            });
        });
        this.nodeCache.on('del', (key: string, value: mannitypes.IVehicleLocation): void => {
            this.eventSubject.next({
                key,
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

    public update(location: mannitypes.IVehicleLocation): void {
        this.assertClosed();
        if (location.isDeleted === true) {
            this.nodeCache.del(location.id);
        } else {
            this.nodeCache.set(location.id, location);
        }
    }

    public updateMultiple(locations: mannitypes.IVehicleLocation[]): void {
        this.assertClosed();
        const deletedLocations: mannitypes.IVehicleLocation[] = [];
        const updateLocations: mannitypes.IVehicleLocation[] = [];
        locations.forEach((location: mannitypes.IVehicleLocation): void => {
            if (location.isDeleted === true) {
                deletedLocations.push(location);
            } else {
                updateLocations.push(location);
            }
        });
        this.nodeCache.mset(updateLocations
            .map((loc: mannitypes.IVehicleLocation): NodeCache.ValueSetItem<mannitypes.IVehicleLocation> => {
                return {
                    key: loc.id,
                    val: loc,
                };
            }));
        this.nodeCache.del(deletedLocations
            .map((loc: mannitypes.IVehicleLocation): string => loc.id));
    }

    public getState(): mannitypes.IVehicleLocation[] {
        this.assertClosed();
        const vehicles: { [key: string]: mannitypes.IVehicleLocation } = this.
            nodeCache.mget<mannitypes.IVehicleLocation>(this.nodeCache.keys());
        return Object.entries(vehicles)
            .map((vehicle: [string, mannitypes.IVehicleLocation]): mannitypes.IVehicleLocation => vehicle[1]);
    }

    public close(): void {
        this.nodeCache.close();
        this.eventSubject.complete();
        this.isClosed = true;
    }
}
