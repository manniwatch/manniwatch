/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import {
    IVehicleLocation,
    IVehicleLocationList,
    TripId,
    VehicleLocations,
} from '@donmahallem/trapeze-api-types';
import { concat, from, of, BehaviorSubject, Observable } from 'rxjs';
import { catchError, debounceTime, flatMap, map } from 'rxjs/operators';
import { ApiService } from './api.service';

export type TimestampedVehicleLocation = IVehicleLocation & {
    lastUpdate: number,
};
export type TimestampedVehicles = VehicleLocations & {
    lastUpdate: number,
};
export interface IData {
    error?: any;
    lastUpdate: number;
    vehicles: TimestampedVehicleLocation[];
}
import { VehicleId } from '@donmahallem/trapeze-api-types';

enum DiffKey { UNCHANGED = 'unchanged', CHANGED = 'changed', ADDED = 'added', REMOVED = 'removed' }
export interface IVehicleDiff {
    added: TimestampedVehicleLocation[];
    changed: TimestampedVehicleLocation[];
    removed: TimestampedVehicleLocation[];
    unchanged: TimestampedVehicleLocation[];
}
interface IInKeysResult { key?: DiffKey; idx: number; vehicle?: TimestampedVehicleLocation; }
export const findInKeys: (inp: IVehicleDiff, keys: DiffKey[], id: VehicleId) => IInKeysResult =
    (inp: IVehicleDiff, keys: DiffKey[], id: VehicleId): IInKeysResult => {
        for (const key of keys) {
            const idx: number = inp[key].findIndex((searchElement: TimestampedVehicleLocation): boolean =>
                searchElement.id === id);
            if (idx >= 0) {
                return {
                    idx,
                    key,
                    vehicle: inp[key][idx],
                };
            }
            return {
                idx,
            };
        }
        return undefined;
    };
export const createVehicleDiff: <T extends TimestampedVehicleLocation[]>(previousState: IVehicleDiff, newVehicles: T) => IVehicleDiff
    = <T extends TimestampedVehicleLocation[]>(previousState: IVehicleDiff, newVehicles: T): IVehicleDiff => {
        const newDiff: IVehicleDiff = {
            added: [],
            changed: [],
            removed: [],
            unchanged: [],
        };
        // tslint:disable-next-line:triple-equals
        const oldDiff: IVehicleDiff = (previousState == undefined) ? {
            added: [],
            changed: [],
            removed: [],
            unchanged: [],
        } : previousState;
        for (const newVehicle of newVehicles) {
            const key: IInKeysResult = findInKeys(oldDiff, [
                DiffKey.ADDED,
                DiffKey.UNCHANGED,
                DiffKey.CHANGED,
            ], newVehicle.id);
            if (newVehicle.isDeleted === true) {
                if (key.idx >= 0) {
                    newDiff.removed.push(newVehicle);
                    continue;
                }
            }
            if (key.idx < 0) {
                newDiff.added.push(newVehicle);
                continue;
            }
            if (key.vehicle.lastUpdate >= newVehicle.lastUpdate) {
                newDiff.unchanged.push(newVehicle);
                continue;
            } else if (key.vehicle.lastUpdate < newVehicle.lastUpdate) {
                newDiff.changed.push(newVehicle);
                continue;
            }
        }
        return newDiff;
    };

type VehicleMap = Map<string, TimestampedVehicles>;
@Injectable({
    providedIn: 'root',
})
export class VehicleService {
    private state: BehaviorSubject<IData> = new BehaviorSubject({ lastUpdate: 0, vehicles: [] });
    constructor(private api: ApiService) {
        const startValue: IData = {
            lastUpdate: 0,
            vehicles: [],
        };
        concat(from([startValue]), this.state.pipe(debounceTime(10000)))
            .pipe(flatMap((previousData: IData) =>
                this.api.getVehicleLocations(previousData.lastUpdate)
                    .pipe(map((value: IVehicleLocationList): IData => {/*
                        if(previousData.lastUpdate!==value.lastUpdate){
                            console.log("New location data acquired",value.lastUpdate)
                        }*/
                        const timestampedNewLocations: TimestampedVehicles[] =
                            value.vehicles
                                .map((veh: IVehicleLocation): TimestampedVehicles =>
                                    Object.assign({
                                        lastUpdate: value.lastUpdate,
                                    }, veh));
                        const reducedVehicles: VehicleMap =
                            timestampedNewLocations.concat(previousData.vehicles)
                                .reduce((prev: VehicleMap, cur: TimestampedVehicles): VehicleMap => {
                                    if (prev.has(cur.id) && prev.get(cur.id).lastUpdate >= cur.lastUpdate) {
                                        return prev;
                                    }
                                    prev.set(cur.id, cur);
                                    return prev;
                                }, new Map());
                        const filterInvalid: TimestampedVehicleLocation[] =
                            Array.from(reducedVehicles.values())
                                .filter((vehState: any): boolean => {
                                    if (vehState) {
                                        if (vehState.isDeleted === true) {
                                            return false;
                                        }
                                        if (vehState.latitude && vehState.longitude) {
                                            return true;
                                        }
                                    }
                                    return false;
                                }) as any;
                        return {
                            lastUpdate: value.lastUpdate,
                            vehicles: filterInvalid,
                        };
                    }), catchError((err: any) =>
                        of(Object.assign({
                            error: err,
                        }, previousData))))))
            .subscribe((data: IData) => {
                this.state.next(data);
            });
    }

    public get getVehicles(): Observable<IData> {
        return this.state;
    }

    public getVehicleByTripId(tripId: TripId): Observable<TimestampedVehicleLocation> {
        return this.state
            .pipe(map((status: IData): TimestampedVehicleLocation => {
                const idx: number = status.vehicles
                    .findIndex((veh: TimestampedVehicleLocation): boolean =>
                        veh.tripId === tripId);
                return idx >= 0 ? status.vehicles[idx] : undefined;
            }));
    }

}
