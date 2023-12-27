/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { IVehicleLocationList, VehicleLocations } from '@manniwatch/api-types';
import manniwatch from '@manniwatch/pb-types';
import { convertVehicleLocation } from './convert-vehicle-location.js';

export const convertVehicleLocations: (loc: IVehicleLocationList) => manniwatch.manniwatch.IVehicleLocationList = (
    loc: IVehicleLocationList,
): manniwatch.manniwatch.IVehicleLocationList => {
    return loc.vehicles.reduce(
        (prev: manniwatch.manniwatch.IVehicleLocationList, cur: VehicleLocations): manniwatch.manniwatch.IVehicleLocationList => {
            prev.locations?.push(convertVehicleLocation(cur, loc.lastUpdate));
            return prev;
        },
        { locations: [] },
    );
};
