/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { IVehicleLocation } from '@manniwatch/api-types';
import manniwatch from '@manniwatch/pb-types';
import { expect } from 'chai';
import{strict as esmock}from 'esmock';
import 'mocha';
import sinon from 'sinon';
import {convertLocation}from './convert-location.js';
import type {convertVehicleLocation} from './convert-vehicle-location.js';
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
        let testMethod:typeof convertVehicleLocation;
        before(async (): Promise<void> => {
            convertCategoryStub = sinon.stub().named('convertVehicleCategory');
            testMethod = (
                await esmock('./convert-vehicle-location.js', {
                    './convert-location.js': {
                        convertLocation: convertLocation,
                    },
                    './convert-vehicle-category.js': {
                        convertVehicleCategory: convertCategoryStub,
                    },
                })
            ).convertVehicleLocation;
        });
        afterEach((): void => {
            convertCategoryStub.reset();
        });
        it('should return all information if source has isDeleted false', (): void => {
            const testLocation: IVehicleLocation = Object.assign({}, TEST_VEHICLE_LOCATION);
            testLocation.isDeleted = false as any;
            convertCategoryStub.returns(299);
            const testResult: manniwatch.manniwatch.IVehicleLocation = testMethod(testLocation, 1000);
            expect(convertCategoryStub.callCount).to.equal(1);
            expect(convertCategoryStub.getCall(0).args).to.deep.equal([TEST_VEHICLE_LOCATION.category]);
            expect(testResult).to.deep.equal({
                details: {
                    category: 299,
                    heading: TEST_VEHICLE_LOCATION.heading,
                    location: {
                        latitude: TEST_VEHICLE_LOCATION.latitude,
                        longitude: TEST_VEHICLE_LOCATION.longitude,
                    },
                    name: TEST_VEHICLE_LOCATION.name,
                    tripId: TEST_VEHICLE_LOCATION.tripId,
                },
                id: TEST_VEHICLE_LOCATION.id,
                lastUpdate: 1000,
            });
        });
        it('should return all information if source has isDeleted set to undefined', (): void => {
            const testLocation: IVehicleLocation = Object.assign({}, TEST_VEHICLE_LOCATION);
            testLocation.isDeleted = undefined;
            convertCategoryStub.returns(299);
            const testResult: manniwatch.IVehicleLocation = testMethod(testLocation, 1000);
            expect(convertCategoryStub.callCount).to.equal(1);
            expect(convertCategoryStub.getCall(0).args).to.deep.equal([TEST_VEHICLE_LOCATION.category]);
            expect(testResult).to.deep.equal({
                details: {
                    category: 299,
                    heading: TEST_VEHICLE_LOCATION.heading,
                    location: {
                        latitude: TEST_VEHICLE_LOCATION.latitude,
                        longitude: TEST_VEHICLE_LOCATION.longitude,
                    },
                    name: TEST_VEHICLE_LOCATION.name,
                    tripId: TEST_VEHICLE_LOCATION.tripId,
                },
                id: TEST_VEHICLE_LOCATION.id,
                lastUpdate: 1000,
            });
        });
        it('should return all information if source has isDeleted set to true', (): void => {
            const testLocation: IVehicleLocation = Object.assign({}, TEST_VEHICLE_LOCATION);
            testLocation.isDeleted = true as any;
            convertCategoryStub.returns(299);
            const testResult: manniwatch.IVehicleLocation = testMethod(testLocation, 1000);
            expect(convertCategoryStub.callCount).to.equal(0);
            expect(testResult).to.deep.equal({
                id: TEST_VEHICLE_LOCATION.id,
                isDeleted: true,
                lastUpdate: 1000,
            });
        });
    });
});
