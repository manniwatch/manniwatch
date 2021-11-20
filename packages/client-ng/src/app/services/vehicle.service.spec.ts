/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { createVehicleDiff, IVehicleDiff } from './vehicle.service';

describe('src/app/services/vehicle.service.ts', (): void => {
    describe('createVehicleDiff(oldVehicles, newVehicles)', (): void => {
        describe('oldVehicles is undefined', (): void => {
            // eslint-disable-next-line no-null/no-null
            [undefined, null].forEach((testValue: undefined | null): void => {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                it(`should pass on new vehicles if olds are ${testValue}`, (): void => {
                    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                    const newVehicles: any[] = [
                        {
                            id: '1',
                        },
                        {
                            id: '2',
                        },
                    ];
                    const result: IVehicleDiff = createVehicleDiff(testValue, newVehicles);
                    void expect(result)
                        .withContext('empty responses')
                        .toEqual({
                            added: newVehicles,
                            changed: [],
                            removed: [],
                            unchanged: [],
                        });
                });
            });
        });
        describe('oldVehicles is defined', (): void => {
            it('should add newly deleted items to removed');
            it('should not report entries only present on the old dataset');
            it('should add new vehicles to "added" if the id is previously unknown and isDeleted is not true');
        });
    });
});
