/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { manniwatch } from '@manniwatch/pb-types';

interface ILocDefinitions { lat?: number; lon?: number; latitude?: number; longitude?: number; }
export const convertLocation: (cat: ILocDefinitions) => manniwatch.ILocation | undefined =
    (cat: ILocDefinitions): manniwatch.ILocation | undefined => {
        if (cat.lat && cat.lon) {
            return {
                latitude: cat.lat,
                longitude: cat.lon,
            };
        } else if (cat.latitude && cat.longitude) {
            return {
                latitude: cat.latitude,
                longitude: cat.longitude,
            };
        }
        return undefined;
    };
