/*!
 * Source https://github.com/manniwatch/manniwatch Package: vehicle-location-diff
 */

import { expect } from 'chai';
import * as sinon from 'sinon';
import { vehicleMapReduce, VehicleDiffHandler, VehicleHashMap } from './vehicle-diff-handler';

interface ISimpleVehicle {
    id: string;
    isDeleted: boolean;
    lastUpdate: number;
}
interface ISimpleVehicleLocationDiff {
    added: ISimpleVehicle[];
    changed: ISimpleVehicle[];
    old: ISimpleVehicle[];
    removed: ISimpleVehicle[];
}
describe('vehicle-diff-handler', (): void => {
    describe('vehicleMapReduce', (): void => {
        it('should add the item at the correct key', (): void => {
            const testInput: any = {
                id: 'testKey',
            };
            const testResult: VehicleHashMap = vehicleMapReduce(new Map(), testInput);
            expect(testResult.get('testKey')).to.deep.equal(testInput);
        });
        it('should keep old entries and add the new item at the correct key', (): void => {
            const testInput: any = {
                id: 'testKey',
            };
            const testResult: VehicleHashMap = vehicleMapReduce(new Map(), testInput);
            expect(testResult.get('testKey')).to.deep.equal(testInput);
        });
    });
    describe('VehicleDiffHandler', (): void => {
        let testInstance: VehicleDiffHandler;
        let sandbox: sinon.SinonSandbox;
        before((): void => {
            sandbox = sinon.createSandbox();
        });
        beforeEach((): void => {
            testInstance = new VehicleDiffHandler();
        });
        afterEach((): void => {
            sandbox.resetHistory();
        });

        describe('convert(list)', (): void => {
            it('should convert an empty list correctly', (): void => {
                expect(VehicleDiffHandler.convert({
                    lastUpdate: 1234,
                    vehicles: [],
                })).to.deep.equal([]);
            });
            it('should add lastUpdate properties to items in vehicles', (): void => {
                const testVehicles: any[] = [{
                    a: 1,
                }, {
                    b: 2,
                }, {
                    c: 3,
                }];
                expect(VehicleDiffHandler.convert({
                    lastUpdate: 1234,
                    vehicles: testVehicles,
                })).to.deep.equal([{
                    a: 1,
                    lastUpdate: 1234,
                }, {
                    b: 2,
                    lastUpdate: 1234,
                }, {
                    c: 3,
                    lastUpdate: 1234,
                }]);
            });
        });
        describe('diff(oldState, newState)', (): void => {
            // tslint:disable-next-line:no-null-keyword
            [undefined, null].forEach((testUndefined: any): void => {
                describe('old state is ' + testUndefined, (): void => {
                    it('should convert an empty list correctly', (): void => {
                        const vehicles: ISimpleVehicle[] = [
                            { id: '1', isDeleted: true, lastUpdate: 2831 },
                            { id: '2', isDeleted: false, lastUpdate: 2832 },
                            { id: '3', isDeleted: true, lastUpdate: 2833 },
                            { id: '4', isDeleted: false, lastUpdate: 2834 }];
                        expect(VehicleDiffHandler.diff(testUndefined, vehicles as any[])).to.deep.equal({
                            added: [vehicles[1], vehicles[3]],
                            changed: [],
                            old: [],
                            removed: [vehicles[0], vehicles[2]],
                        });
                    });
                });
            });
            describe('old state is defined', (): void => {
                it('should work if oldstate is empty', (): void => {
                    const vehicles: ISimpleVehicle[] = [
                        { id: '1', isDeleted: true, lastUpdate: 2831 },
                        { id: '2', isDeleted: false, lastUpdate: 2832 },
                        { id: '3', isDeleted: true, lastUpdate: 2833 },
                        { id: '4', isDeleted: false, lastUpdate: 2834 }];
                    expect(VehicleDiffHandler.diff({
                        added: [],
                        changed: [],
                        old: [],
                        removed: [],
                    }, vehicles as any[])).to.deep.equal({
                        added: [vehicles[1], vehicles[3]],
                        changed: [],
                        old: [],
                        removed: [vehicles[0], vehicles[2]],
                    });
                });
                it('handle ids not present in the new data', (): void => {
                    expect(VehicleDiffHandler.diff({
                        added: [
                            { id: '1', isDeleted: false, lastUpdate: 2831 } as any,
                        ],
                        changed: [
                            { id: '2', isDeleted: false, lastUpdate: 2831 } as any,
                        ],
                        old: [
                            { id: '3', isDeleted: false, lastUpdate: 2831 } as any,
                        ],
                        removed: [
                            { id: '4', isDeleted: true, lastUpdate: 2831 } as any,
                        ],
                    }, [])).to.deep.equal({
                        added: [],
                        changed: [],
                        old: [
                            { id: '1', isDeleted: false, lastUpdate: 2831 } as any,
                            { id: '2', isDeleted: false, lastUpdate: 2831 } as any,
                            { id: '3', isDeleted: false, lastUpdate: 2831 } as any,
                        ],
                        removed: [
                            { id: '4', isDeleted: true, lastUpdate: 2831 } as any,
                        ],
                    });
                });
                it('should use always the latest deleted item', (): void => {
                    const vehicles: ISimpleVehicle[] = [
                        { id: '1', isDeleted: true, lastUpdate: 20 },
                        { id: '2', isDeleted: true, lastUpdate: 10 },
                        { id: '3', isDeleted: true, lastUpdate: 20 },
                    ];
                    expect(VehicleDiffHandler.diff({
                        added: [],
                        changed: [
                            { id: '1', isDeleted: false, lastUpdate: 10 } as any,
                        ],
                        old: [],
                        removed: [
                            { id: '2', isDeleted: true, lastUpdate: 20 } as any,
                            { id: '3', isDeleted: true, lastUpdate: 20 } as any,
                        ],
                    }, vehicles as any[])).to.deep.equal({
                        added: [],
                        changed: [],
                        old: [],
                        removed: [
                            { id: '1', isDeleted: true, lastUpdate: 20 } as any,
                            { id: '2', isDeleted: true, lastUpdate: 20 } as any,
                            { id: '3', isDeleted: true, lastUpdate: 20 } as any,
                        ],
                    });
                });
                it('move entries to updated if not changed', (): void => {
                    const vehicles: ISimpleVehicle[] = [
                        { id: '1', isDeleted: false, lastUpdate: 6 },
                        { id: '2', isDeleted: false, lastUpdate: 6 },
                        { id: '3', isDeleted: true, lastUpdate: 6 },
                        { id: '4', isDeleted: false, lastUpdate: 6 },
                        { id: '5', isDeleted: false, lastUpdate: 6 },
                        { id: '6', isDeleted: true, lastUpdate: 6 },
                        { id: '7', isDeleted: false, lastUpdate: 6 },
                        { id: '8', isDeleted: false, lastUpdate: 6 },
                        { id: '9', isDeleted: true, lastUpdate: 6 },
                        { id: '10', isDeleted: false, lastUpdate: 6 },
                        { id: '11', isDeleted: false, lastUpdate: 6 },
                        { id: '12', isDeleted: true, lastUpdate: 6 },
                        { id: '13', isDeleted: false, lastUpdate: 6 }];
                    const testOldState: ISimpleVehicleLocationDiff = {
                        added: [
                            { id: '1', isDeleted: false, lastUpdate: 5 },
                            { id: '2', isDeleted: false, lastUpdate: 6 },
                            { id: '3', isDeleted: false, lastUpdate: 7 },
                        ],
                        changed: [
                            { id: '4', isDeleted: false, lastUpdate: 5 },
                            { id: '5', isDeleted: false, lastUpdate: 6 },
                            { id: '6', isDeleted: false, lastUpdate: 7 },
                        ],
                        old: [
                            { id: '7', isDeleted: false, lastUpdate: 5 },
                            { id: '8', isDeleted: false, lastUpdate: 6 },
                            { id: '9', isDeleted: false, lastUpdate: 7 },
                        ],
                        removed: [
                            { id: '10', isDeleted: true, lastUpdate: 5 },
                            { id: '11', isDeleted: true, lastUpdate: 6 },
                            { id: '12', isDeleted: true, lastUpdate: 7 },
                        ],
                    };
                    expect(VehicleDiffHandler.diff(testOldState as any, vehicles as any[])).to.deep.equal({
                        added: [
                            { id: '10', isDeleted: false, lastUpdate: 6 },
                            { id: '13', isDeleted: false, lastUpdate: 6 },
                        ],
                        changed: [
                            { id: '1', isDeleted: false, lastUpdate: 6 },
                            { id: '4', isDeleted: false, lastUpdate: 6 },
                            { id: '7', isDeleted: false, lastUpdate: 6 },
                        ],
                        old: [
                            { id: '2', isDeleted: false, lastUpdate: 6 },
                            { id: '3', isDeleted: false, lastUpdate: 7 },
                            { id: '5', isDeleted: false, lastUpdate: 6 },
                            { id: '6', isDeleted: false, lastUpdate: 7 },
                            { id: '8', isDeleted: false, lastUpdate: 6 },
                            { id: '9', isDeleted: false, lastUpdate: 7 },
                        ],
                        removed: [
                            { id: '11', isDeleted: true, lastUpdate: 6 },
                            { id: '12', isDeleted: true, lastUpdate: 7 },
                        ],
                    });
                });
            });
        });
        it('needs impl', (): void => {
            expect(testInstance).to.not.equal(false);
        });
    });
});
