/*
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import Ajv, { ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { INT_SCHEMA } from './int.js';

const validValues: (string | number)[] = ['1', '+0', '-200', 0, 2, -5];
const invalidValues: (string | number)[] = ['-1a', 'b', '200.2', 0.39];

// tslint:disable:no-unused-expression
describe('endpoints/schema/int', (): void => {
    let ajvInstance: Ajv;
    let validator: ValidateFunction;
    beforeEach('setup Ajv and validation function', (): void => {
        ajvInstance = new Ajv({ strict: true });
        validator = ajvInstance.compile(INT_SCHEMA);
    });
    describe('INT_SCHEMA', (): void => {
        validValues.forEach((testValue: string | number): void => {
            it(`should accept ${testValue} with type '${typeof testValue}'`, (): void => {
                expect(validator(testValue)).to.be.true;
            });
        });
        invalidValues.forEach((testValue: string | number): void => {
            it(`should reject ${testValue} with type '${typeof testValue}'`, (): void => {
                expect(validator(testValue)).to.be.false;
            });
        });
    });
});
