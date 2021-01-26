import { IVehicleLocation, VehicleLocations } from '@manniwatch/api-types';
import * as NodeCache from 'node-cache';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

export interface CacheEvent {
    type: 'delete' | 'update';
    location: VehicleLocations;
}
export class VehicleCache {
    private readonly nodeCache: NodeCache;
    private readonly eventSubject: Subject<CacheEvent>;
    public readonly eventObservable: Observable<CacheEvent>;
    private isClosed: boolean = false;
    public constructor(opts?: NodeCache.Options) {
        this.nodeCache = new NodeCache(opts);
        this.eventSubject = new Subject();
        this.eventObservable = this.eventSubject
            .pipe(share());
        this.nodeCache.on('set', (item: CacheEvent): void => {
            this.eventSubject.next(item);
        });
        this.nodeCache.on('del', (item: CacheEvent): void => {
            this.eventSubject.next(item);
        });
    }

    private assertClosed(): void {
        if (this.isClosed === true) {
            throw new Error('The cache has been closed');
        }
    }

    public update(location: VehicleLocations): void {
        this.assertClosed();
        if (location.isDeleted === true) {
            this.nodeCache.del(location.id);
        } else {
            this.nodeCache.set(location.id, location);
        }
    }

    public updateMultiple(locations: VehicleLocations[]): void {
        this.assertClosed();
        const deletedLocations: VehicleLocations[] = [];
        const updateLocations: VehicleLocations[] = [];
        locations.forEach((location: VehicleLocations): void => {
            if (location.isDeleted === true) {
                deletedLocations.push(location);
            } else {
                updateLocations.push(location);
            }
        });
        this.nodeCache.mset(updateLocations
            .map((loc: VehicleLocations): NodeCache.ValueSetItem<VehicleLocations> => {
                return {
                    key: loc.id,
                    val: loc,
                };
            }));
        this.nodeCache.del(updateLocations
            .map((loc: VehicleLocations): string => loc.id));
    }

    public getState(): IVehicleLocation[] {
        this.assertClosed();
        const vehicles: { [key: string]: IVehicleLocation } = this.nodeCache.mget<IVehicleLocation>(this.nodeCache.keys());
        return Object.entries(vehicles).map(vehicle => vehicle[1]);
    }

    public close(): void {
        this.nodeCache.close();
        this.eventSubject.complete();
        this.isClosed = true;
    }
}