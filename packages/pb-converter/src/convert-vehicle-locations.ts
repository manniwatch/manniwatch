/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/pb-converter
*/

import { IVehicleLocationList, VehicleLocations } from '@manniwatch/api-types';
import { manniwatch } from '@manniwatch/pb-types';
import { convertVehicleLocation } from './convert-vehicle-location';

export const convertVehicleLocations: (loc: IVehicleLocationList) => manniwatch.IVehicleLocationList =
    (loc: IVehicleLocationList): manniwatch.IVehicleLocationList => loc
        .vehicles
        .reduce((prev: manniwatch.IVehicleLocationList, cur: VehicleLocations): manniwatch.IVehicleLocationList => {
            prev.locations?.push(convertVehicleLocation(cur, loc.lastUpdate));
            return prev;
        }, { locations: [] });
