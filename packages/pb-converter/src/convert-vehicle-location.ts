/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/pb-converter
*/

import { VehicleLocations } from '@manniwatch/api-types';
import { manniwatch } from '@manniwatch/pb-types';
import { convertLocation } from './convert-location';
import * as convertVehicleCategory from './convert-vehicle-category';

export const convertVehicleLocation: (loc: VehicleLocations, timestamp: number) => manniwatch.IVehicleLocation =
    (loc: VehicleLocations, timestamp: number): manniwatch.IVehicleLocation => {
        if (loc.isDeleted === true) {
            return {
                id: loc.id,
                isDeleted: true,
                lastUpdate: timestamp,
            };
        }
        return {
            details: {
                category: convertVehicleCategory.convertVehicleCategory(loc.category),
                heading: loc.heading,
                location: convertLocation(loc),
                name: loc.name,
                tripId: loc.tripId,
            },
            id: loc.id,
            lastUpdate: timestamp,
        };
    };
