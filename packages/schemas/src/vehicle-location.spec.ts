/**
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import Ajv, { ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { GET_VEHICLE_LOCATION_SCHEMA } from './vehicle-location.js';

const validTestNumbers: (number | string)[] = [3, '2', '0', '+4'];
const invalidTestNumbers: (number | string)[] = [-1, '-2'];

/* eslint-disable mocha/no-setup-in-describe */
describe('endpoints/schema/vehicle-location', function (): void {
    let ajvInstance: Ajv;
    let validator: ValidateFunction;

    beforeEach('setup Ajv and validation function', function (): void {
        ajvInstance = new Ajv({ strict: true });
        validator = ajvInstance.compile(GET_VEHICLE_LOCATION_SCHEMA);
    });

    describe('GET_VEHICLE_LOCATION_SCHEMA', function (): void {
        describe('$root.lastUpdate', function (): void {
            validTestNumbers.forEach((testValue: string | number): void => {
                it(`should pass for ${testValue}`, function (): void {
                    expect(
                        validator({
                            lastUpdate: testValue,
                        }),
                        'schema should be valid'
                    ).to.be.true;
                });
            });
            invalidTestNumbers.forEach((testValue: string | number): void => {
                it(`should reject for ${testValue}`, function (): void {
                    expect(
                        validator({
                            lastUpdate: testValue,
                        }),
                        'schema should not be valid'
                    ).to.be.false;
                });
            });
        });

        describe('$root.positionType', function (): void {
            ['RAW', 'CORRECTED'].forEach((testValue: string | number): void => {
                it(`should pass for ${testValue}`, function (): void {
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
                it(`should reject for ${testValue === null ? 'null' : testValue}`, function (): void {
                    expect(
                        validator({
                            positionType: testValue,
                        }),
                        'schema should not be valid'
                    ).to.be.false;
                });
            });
        });

        it(`should reject unknown properties`, function (): void {
            expect(
                validator({
                    unknown: 'property',
                }),
                'schema should not be valid'
            ).to.be.false;
        });
    });
});
