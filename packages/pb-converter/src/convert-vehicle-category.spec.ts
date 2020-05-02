/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { manniwatch } from '@manniwatch/pb-types';
import { expect } from 'chai';
import 'mocha';
import * as testObject from './convert-vehicle-category';
describe('convert-vehicle-location.ts', (): void => {
    describe('convertCategory(cat)', (): void => {
        it('should convert "bus" to Category.BUS', (): void => {
            expect(testObject.convertVehicleCategory('bus')).to.equal(manniwatch.VehicleLocation.Category.BUS);
        });
        it('should convert "tram" to Category.TRAM', (): void => {
            expect(testObject.convertVehicleCategory('tram')).to.equal(manniwatch.VehicleLocation.Category.TRAM);
        });
        it('should convert "any value" to Category.OTHER', (): void => {
            expect(testObject.convertVehicleCategory('any value' as any)).to.equal(manniwatch.VehicleLocation.Category.OTHER);
        });
    });
});
