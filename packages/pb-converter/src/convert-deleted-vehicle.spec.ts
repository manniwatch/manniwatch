/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { expect } from 'chai';
import 'mocha';
import * as testObject from './convert-deleted-vehicle';
describe('convert-deleted-vehicle.ts', (): void => {
    describe('convertDeletedVehicle(veh,lastUpdate)', (): void => {
        it('should convert correctly to a deleted vehicle', (): void => {
            expect(testObject.convertDeletedVehicle({ id: 'testid1', isDeleted: true }, 2939))
                .to.deep.equal({ id: 'testid1', lastUpdate: 2939 });
        });
    });
});
