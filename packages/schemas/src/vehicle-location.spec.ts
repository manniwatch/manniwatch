/*
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import Ajv, { ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { GET_VEHICLE_LOCATION_SCHEMA } from './vehicle-location';

const validTestNumbers: (number | string)[] = [3, '2', '0', '+4'];
const invalidTestNumbers: (number | string)[] = [-1, '-2'];

// tslint:disable:no-unused-expression
describe('endpoints/schema/vehicle-location', (): void => {
    let ajvInstance: Ajv;
    let validator: ValidateFunction;
    beforeEach('setup Ajv and validation function', (): void => {
        ajvInstance = new Ajv({ strict: true });
        validator = ajvInstance.compile(GET_VEHICLE_LOCATION_SCHEMA);
    });
    describe('GET_VEHICLE_LOCATION_SCHEMA', (): void => {
        describe('$root.lastUpdate', (): void => {
            validTestNumbers.forEach((testValue: string | number): void => {
                it(`should pass for ${testValue}`, (): void => {
                    expect(
                        validator({
                            lastUpdate: testValue,
                        }),
                        'schema should be valid'
                    ).to.be.true;
                });
            });
            invalidTestNumbers.forEach((testValue: string | number): void => {
                it(`should reject for ${testValue}`, (): void => {
                    expect(
                        validator({
                            lastUpdate: testValue,
                        }),
                        'schema should not be valid'
                    ).to.be.false;
                });
            });
        });
        describe('$root.positionType', (): void => {
            ['RAW', 'CORRECTED'].forEach((testValue: string | number): void => {
                it(`should pass for ${testValue}`, (): void => {
                    expect(
                        validator({
                            positionType: testValue,
                        }),
                        'schema should be valid'
                    ).to.be.true;
                });
            });
            // tslint:disable-next-line:no-null-keyword
            [null, 'any'].forEach((testValue: string | null): void => {
                it(`should reject for ${testValue === null ? 'null' : testValue}`, (): void => {
                    expect(
                        validator({
                            positionType: testValue,
                        }),
                        'schema should not be valid'
                    ).to.be.false;
                });
            });
        });
        it(`should reject unknown properties`, (): void => {
            expect(
                validator({
                    unknown: 'property',
                }),
                'schema should not be valid'
            ).to.be.false;
        });
    });
});
