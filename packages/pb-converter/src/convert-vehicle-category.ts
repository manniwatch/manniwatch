/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { VehicleCategory } from '@manniwatch/api-types';
import { manniwatch } from '@manniwatch/pb-types';

export const convertVehicleCategory: (cat: VehicleCategory) => manniwatch.VehicleLocation.Category =
    (cat: VehicleCategory): manniwatch.VehicleLocation.Category => {
        switch (cat) {
            case 'bus':
                return manniwatch.VehicleLocation.Category.BUS;
            case 'tram':
                return manniwatch.VehicleLocation.Category.TRAM;
            default:
                return manniwatch.VehicleLocation.Category.OTHER;
        }
    };
