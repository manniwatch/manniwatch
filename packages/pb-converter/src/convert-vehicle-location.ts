/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { VehicleLocations } from '@manniwatch/api-types';
import { manniwatch } from '@manniwatch/pb-types';
import * as convertVehicleCategory from './convert-vehicle-category';
export const convertVehicleLocation: (loc: VehicleLocations, timestamp: number) => manniwatch.IVehicleLocation =
    (loc: VehicleLocations, timestamp: number): manniwatch.IVehicleLocation => {
        if (loc.isDeleted === true) {
            return {
                id: loc.id,
                isDeleted: true,
                timestamp,
            };
        }
        return {
            category: convertVehicleCategory.convertVehicleCategory(loc.category),
            heading: loc.heading,
            id: loc.id,
            isDeleted: false,
            location: {
                latitude: loc.latitude,
                longitude: loc.longitude,
            },
            name: loc.name,
            timestamp,
            tripId: loc.tripId,
        };
    };
