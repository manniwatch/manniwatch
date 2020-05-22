/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { VehicleCategory } from '@manniwatch/api-types';
import { manniwatch } from '@manniwatch/pb-types';

export const convertVehicleCategory: (cat: VehicleCategory) => manniwatch.VehicleCategory =
    (cat: VehicleCategory): manniwatch.VehicleCategory => {
        switch (cat) {
            case 'bus':
                return manniwatch.VehicleCategory.BUS;
            case 'tram':
                return manniwatch.VehicleCategory.TRAM;
            default:
                return manniwatch.VehicleCategory.OTHER;
        }
    };
