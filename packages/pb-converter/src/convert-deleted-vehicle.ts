/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { IDeletedVehicleLocation } from '@manniwatch/api-types';
import { manniwatch } from '@manniwatch/pb-types';

export const convertDeletedVehicle: (cat: IDeletedVehicleLocation, lastUpdate: number) => manniwatch.IDeletedVehicle =
    (cat: IDeletedVehicleLocation, lastUpdate: number): manniwatch.IDeletedVehicle => {
        return {
            id: cat.id,
            lastUpdate,
        };
    };
