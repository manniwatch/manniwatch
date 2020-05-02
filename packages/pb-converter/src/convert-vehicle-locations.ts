/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { IVehicleLocation, IVehicleLocationList } from '@manniwatch/api-types';
import { manniwatch } from '@manniwatch/pb-types';
import { convertVehicleLocation } from './convert-vehicle-location';

export const convertVehicleLocations: (loc: IVehicleLocationList) => manniwatch.IVehicleLocations =
    (loc: IVehicleLocationList): manniwatch.IVehicleLocations => {
        return {
            locations: loc.vehicles.map((vehicleLocation: IVehicleLocation): manniwatch.IVehicleLocation => {
                return convertVehicleLocation(vehicleLocation, loc.lastUpdate);
            }),
        };
    };
