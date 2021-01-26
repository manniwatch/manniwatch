import { IVehicleLocation, VehicleLocations } from '@manniwatch/api-types';
import * as NodeCache from 'node-cache';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

export interface CacheEvent {
    type: 'delete' | 'update';
    location: VehicleLocations;
}
export class VehicleCache {
    private nodeCache: NodeCache;
    private eventSubject: Subject<CacheEvent>;
    public readonly eventObservable: Observable<CacheEvent>;
    public constructor(opts: NodeCache.Options) {
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

    public update(location: VehicleLocations): void {
        if (location.isDeleted === true) {
            this.nodeCache.del(location.id);
        } else {
            this.nodeCache.set(location.id, location);
        }
    }

    public updateMultiple(locations: VehicleLocations[]): void {
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
        const vehicles: { [key: string]: IVehicleLocation } = this.nodeCache.mget<IVehicleLocation>(this.nodeCache.keys());
        return Object.entries(vehicles).map(vehicle => vehicle[1]);
    }

}