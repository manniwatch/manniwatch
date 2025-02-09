/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { expect } from 'chai';
import esmock from 'esmock';
import 'mocha';
import sinon from 'sinon';
import type{convertVehicleLocations} from './convert-vehicle-locations.js';
describe('convert-vehicle-locations.ts', (): void => {
    describe('convertVehicleLocations(locs)', (): void => {
        let convertVehicleLocationStub: sinon.SinonStub;
        let testMethod: typeof convertVehicleLocations;
        before(async ():  Promise<void> => {
            convertVehicleLocationStub = sinon.stub().named('convertVehicleLocation');
            testMethod = (
                await esmock.strict('./convert-vehicle-locations.js', {
                    './convert-vehicle-location.js': {
                        convertVehicleLocation: convertVehicleLocationStub,
                    },
                })
            ).convertVehicleLocations;
        });
        afterEach((): void => {
            convertVehicleLocationStub.reset();
        });
        it('should return an empty array if vehicles is an empty array', (): void => {
            expect(testMethod({ vehicles: [], lastUpdate: 2000 })).to.deep.equal({
                locations: [],
            });
        });
        it('should convert provided vehicles', (): void => {
            const testValues: any = [1, 2, 3, { isDeleted: true, id: 4 }];
            convertVehicleLocationStub.returnsArg(0);
            expect(testMethod({ vehicles: testValues, lastUpdate: 2000 })).to.deep.equal({
                locations: [1, 2, 3, { id: 4, isDeleted: true }],
            }, 'expected all locations to be converted');
            expect(convertVehicleLocationStub.args).to.deep.equal([[1, 2000], [2, 2000], [3, 2000], [{ id: 4, isDeleted: true }, 2000]]);
        });
    });
});
