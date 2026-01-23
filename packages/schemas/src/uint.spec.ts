/**
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import Ajv, { ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { UINT_SCHEMA } from './uint.js';

const validValues: (string | number)[] = ['1', '+0', '200', 0, 2, 5];
const invalidValues: (string | number)[] = ['-1a', 'b', '-200.2', 0.39, -10];

/* eslint-disable mocha/no-setup-in-describe */
describe('endpoints/schema/uint', function (): void {
    let ajvInstance: Ajv;
    let validator: ValidateFunction;

    beforeEach('setup Ajv and validation function', function (): void {
        ajvInstance = new Ajv({ strict: true });
        validator = ajvInstance.compile(UINT_SCHEMA);
    });

    describe('UINT_SCHEMA', function (): void {
        validValues.forEach((testValue: string | number): void => {
            it(`should accept ${testValue} with type '${typeof testValue}'`, function (): void {
                expect(validator(testValue)).to.be.true;
            });
        });
        invalidValues.forEach((testValue: string | number): void => {
            it(`should reject ${testValue} with type '${typeof testValue}'`, function (): void {
                expect(validator(testValue)).to.be.false;
            });
        });
    });
});
