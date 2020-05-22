/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { IVehicleLocationList, VehicleLocations } from '@manniwatch/api-types';
import { manniwatch } from '@manniwatch/pb-types';
import { convertDeletedVehicle } from './convert-deleted-vehicle';
import { convertVehicleLocation } from './convert-vehicle-location';

export const convertVehicleLocations: (loc: IVehicleLocationList) => manniwatch.IVehicleLocationList =
    (loc: IVehicleLocationList): manniwatch.IVehicleLocationList => {
        return loc.vehicles.reduce((prev: manniwatch.IVehicleLocationList, cur: VehicleLocations): manniwatch.IVehicleLocationList => {
            if (cur.isDeleted === true) {
                prev.deleted?.push(convertDeletedVehicle(cur, loc.lastUpdate));
            } else {
                prev.actual?.push(convertVehicleLocation(cur, loc.lastUpdate));
            }
            return prev;
        }, { actual: [], deleted: [] });
    };
