/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import * as convertVehicleLocation from './convert-vehicle-location';
import * as testObject from './convert-vehicle-locations';
describe('convert-vehicle-locations.ts', (): void => {
    describe('convertVehicleLocations(locs)', (): void => {
        let convertCategoryStub: sinon.SinonStub;
        before((): void => {
            convertCategoryStub = sinon.stub(convertVehicleLocation, 'convertVehicleLocation');
        });
        afterEach((): void => {
            convertCategoryStub.reset();
        });
        after((): void => {
            convertCategoryStub.restore();
        });
        it('should return an empty array if vehicles is an empty array', (): void => {
            expect(testObject.convertVehicleLocations({ vehicles: [], lastUpdate: 2000 })).to.deep.equal({
                locations: [],
            });
        });
        it('should convert provided vehicles', (): void => {
            const testValues: any = [1, 2, 3, { isDeleted: true, id: 4 }];
            convertCategoryStub.returnsArg(0);
            expect(testObject.convertVehicleLocations({ vehicles: testValues, lastUpdate: 2000 })).to.deep.equal({
                locations: [1, 2, 3, { id: 4, isDeleted: true }],
            }, 'expected all locations to be converted');
            expect(convertCategoryStub.args).to.deep.equal([[1, 2000], [2, 2000], [3, 2000], [{ id: 4, isDeleted: true }, 2000]]);
        });
    });
});
