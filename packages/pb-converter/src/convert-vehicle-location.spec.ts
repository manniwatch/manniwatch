/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { IVehicleLocation, VehicleLocations } from '@manniwatch/api-types';
import { manniwatch } from '@manniwatch/pb-types';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as convertVehicleCategory from './convert-vehicle-category';
import * as testObject from './convert-vehicle-location';
const TEST_VEHICLE_LOCATION: IVehicleLocation | any = {
    category: 'bus',
    color: '#FF0000',
    heading: 29,
    id: 'anytestid',
    isDeleted: false,
    latitude: 292,
    longitude: 928,
    name: 'Vehicle Name',
    path: [],
    tripId: 'test trip id',
};
describe('convert-vehicle-location.ts', (): void => {
    describe('convertVehicleLocation(loc,timestamp)', (): void => {
        let convertCategoryStub: sinon.SinonStub;
        before((): void => {
            convertCategoryStub = sinon.stub(convertVehicleCategory, 'convertVehicleCategory');
        });
        afterEach((): void => {
            convertCategoryStub.reset();
        });
        after((): void => {
            convertCategoryStub.restore();
        });
        it('only return id, timestamp and isDeleted if source has isDeleted true', (): void => {
            const testLocation: VehicleLocations = Object.assign({}, TEST_VEHICLE_LOCATION);
            testLocation.isDeleted = true;
            expect(testObject.convertVehicleLocation(testLocation, 1000)).to.deep.equal({
                id: TEST_VEHICLE_LOCATION.id,
                isDeleted: true,
                timestamp: 1000,
            });
        });
        it('should return all information if source has isDeleted false', (): void => {
            const testLocation: VehicleLocations = Object.assign({}, TEST_VEHICLE_LOCATION);
            testLocation.isDeleted = false as any;
            convertCategoryStub.returns(299);
            const testResult: manniwatch.IVehicleLocation = testObject.convertVehicleLocation(testLocation, 1000);
            expect(convertCategoryStub.callCount).to.equal(1);
            expect(convertCategoryStub.getCall(0).args).to.deep.equal([TEST_VEHICLE_LOCATION.category]);
            expect(testResult).to.deep.equal({
                category: 299,
                heading: TEST_VEHICLE_LOCATION.heading,
                id: TEST_VEHICLE_LOCATION.id,
                isDeleted: false,
                location: {
                    latitude: TEST_VEHICLE_LOCATION.latitude,
                    longitude: TEST_VEHICLE_LOCATION.longitude,
                },
                name: TEST_VEHICLE_LOCATION.name,
                timestamp: 1000,
                tripId: TEST_VEHICLE_LOCATION.tripId,
            });
        });
    });
});
