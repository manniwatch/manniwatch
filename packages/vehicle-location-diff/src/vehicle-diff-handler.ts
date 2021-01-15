// Source https://github.com/manniwatch/manniwatch Package: vehicle-location-diff

import { IVehicleLocation, IVehicleLocationList } from '@manniwatch/api-types';

export type ITimestampedVehicleLocation = IVehicleLocation & {
    lastUpdate: number;
};
export type ITimestampedVehicleLocations = ITimestampedVehicleLocation[];
export interface IVehicleLocationDiff {
    added: ITimestampedVehicleLocations;
    changed: ITimestampedVehicleLocations;
    old: ITimestampedVehicleLocations;
    removed: ITimestampedVehicleLocations;
}
export type VehicleHashMap = Map<string, ITimestampedVehicleLocation>;
/**
 * Reduces list to a Map with the ids as keys
 */
export const vehicleMapReduce: (prev: VehicleHashMap, curr: ITimestampedVehicleLocation) => VehicleHashMap =
    (prev: VehicleHashMap, curr: ITimestampedVehicleLocation): VehicleHashMap => {
        prev.set(curr.id, curr);
        return prev;
    };
export class VehicleDiffHandler {

    public static convert(list: IVehicleLocationList): ITimestampedVehicleLocation[] {
        return list.vehicles
            .map((loc: IVehicleLocation): ITimestampedVehicleLocation => Object.assign({
                lastUpdate: list.lastUpdate,
            }, loc));
    }

    public static diff(oldState: IVehicleLocationDiff | undefined, newState: ITimestampedVehicleLocation[]): IVehicleLocationDiff {
        // eslint-disable-next-line eqeqeq
        if (oldState == undefined) {
            return newState.reduce((prev: IVehicleLocationDiff, curr: ITimestampedVehicleLocation): IVehicleLocationDiff => {
                if (curr.isDeleted === true) {
                    prev.removed.push(curr);
                } else {
                    prev.added.push(curr);
                }
                return prev;
            }, {
                added: [],
                changed: [],
                old: [],
                removed: [],
            });
        }
        const keysOld: VehicleHashMap = new Map<string, ITimestampedVehicleLocation>();
        oldState.added.reduce(vehicleMapReduce, keysOld);
        oldState.changed.reduce(vehicleMapReduce, keysOld);
        oldState.old.reduce(vehicleMapReduce, keysOld);
        oldState.removed.reduce(vehicleMapReduce, keysOld);
        const keysNew: VehicleHashMap = newState.reduce(vehicleMapReduce, new Map<string, ITimestampedVehicleLocation>());
        const changed: ITimestampedVehicleLocation[] = [];
        const removed: ITimestampedVehicleLocation[] = [];
        const added: ITimestampedVehicleLocation[] = [];
        const old: ITimestampedVehicleLocation[] = [];
        const handled: Map<string, true> = new Map<string, true>();
        for (const key of keysNew.keys()) {
            const newEntry: ITimestampedVehicleLocation = keysNew.get(key) as ITimestampedVehicleLocation;
            const oldEntry: ITimestampedVehicleLocation = keysOld.get(key) as ITimestampedVehicleLocation;
            // eslint-disable-next-line eqeqeq
            if (oldEntry == undefined) {
                handled.set(key, true);
                if (newEntry.isDeleted) {
                    removed.push(keysNew.get(key) as ITimestampedVehicleLocation);
                } else {
                    added.push(keysNew.get(key) as ITimestampedVehicleLocation);
                }
                continue;
            }
            handled.set(key, true);
            if (oldEntry.lastUpdate < newEntry.lastUpdate) {
                if (newEntry.isDeleted === true) {
                    removed.push(newEntry);
                } else if (oldEntry.isDeleted === true) {
                    added.push(newEntry);
                } else {
                    changed.push(newEntry);
                }
            } else {
                if (oldEntry.isDeleted === true) {
                    removed.push(oldEntry);
                } else {
                    old.push(oldEntry);
                }
            }
        }
        for (const testValue of keysOld.values()) {
            if (!handled.get(testValue.id)) {
                if (testValue.isDeleted === true) {
                    removed.push(testValue);
                    continue;
                }
                old.push(testValue);
            }
        }

        return {
            added,
            changed,
            old,
            removed,
        };

    }

}
