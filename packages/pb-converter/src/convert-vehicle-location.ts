/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { IVehicleLocation } from '@manniwatch/api-types';
import { manniwatch } from '@manniwatch/pb-types';
import { convertLocation } from './convert-location';
import * as convertVehicleCategory from './convert-vehicle-category';
export const convertVehicleLocation: (loc: IVehicleLocation, timestamp: number) => manniwatch.IVehicleLocation =
    (loc: IVehicleLocation, timestamp: number): manniwatch.IVehicleLocation => {
        return {
            category: convertVehicleCategory.convertVehicleCategory(loc.category),
            heading: loc.heading,
            id: loc.id,
            lastUpdate: timestamp,
            location: convertLocation(loc),
            name: loc.name,
            tripId: loc.tripId,
        };
    };
