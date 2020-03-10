/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { createVehicleDiff, IVehicleDiff } from './vehicle.service';

describe('src/app/services/vehicle.service.ts', () => {
    describe('createVehicleDiff(oldVehicles, newVehicles)', () => {
        describe('oldVehicles is undefined', () => {
            // tslint:disable-next-line:no-null-keyword
            [undefined, null].forEach((testValue: any): void => {
                it('should pass on new vehicles if olds are ' + testValue, () => {
                    const newVehicles: any[] = [
                        {
                            id: '1',
                        },
                        {
                            id: '2',
                        },
                    ];
                    const result: IVehicleDiff = createVehicleDiff(testValue, newVehicles);
                    expect(result).toEqual({
                        added: newVehicles,
                        changed: [],
                        removed: [],
                        unchanged: [],
                    });
                });
            });
        });
        describe('oldVehicles is defined', () => {
            it('should add newly deleted items to removed');
            it('should not report entries only present on the old dataset');
            it('should add new vehicles to "added" if the id is previously unknown and isDeleted is not true');
        });
    });
});
