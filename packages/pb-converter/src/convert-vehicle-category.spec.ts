/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/pb-converter
*/

import { manniwatch } from '@manniwatch/pb-types';
import { expect } from 'chai';
import 'mocha';
import * as testObject from './convert-vehicle-category';
describe('convert-vehicle-category.ts', (): void => {
    describe('convertCategory(cat)', (): void => {
        it('should convert "bus" to Category.BUS', (): void => {
            expect(testObject.convertVehicleCategory('bus')).to.equal(manniwatch.VehicleCategory.BUS);
        });
        it('should convert "tram" to Category.TRAM', (): void => {
            expect(testObject.convertVehicleCategory('tram')).to.equal(manniwatch.VehicleCategory.TRAM);
        });
        it('should convert "any value" to Category.OTHER', (): void => {
            expect(testObject.convertVehicleCategory('any value' as any)).to.equal(manniwatch.VehicleCategory.OTHER);
        });
    });
});
