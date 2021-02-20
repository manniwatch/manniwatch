/*!
 * Source https://github.com/manniwatch/manniwatch Package: schemas
 */

import Ajv, { ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { UINT_SCHEMA } from './uint';

const validValues: (string | number)[] = ['1', '+0', '200', 0, 2, 5];
const invalidValues: (string | number)[] = ['-1a', 'b', '-200.2', 0.39, -10];

// tslint:disable:no-unused-expression
describe('endpoints/schema/uint', (): void => {
    let ajvInstance: Ajv;
    let validator: ValidateFunction;
    beforeEach('setup Ajv and validation function', (): void => {
        ajvInstance = new Ajv({ strict: true });
        validator = ajvInstance.compile(UINT_SCHEMA);
    });
    describe('UINT_SCHEMA', (): void => {
        validValues.forEach((testValue: (string | number)): void => {
            it(`should accept ${testValue} with type '${typeof testValue}'`, (): void => {
                expect(validator(testValue)).to.be.true;
            });
        });
        invalidValues.forEach((testValue: (string | number)): void => {
            it(`should reject ${testValue} with type '${typeof testValue}'`, (): void => {
                expect(validator(testValue)).to.be.false;
            });
        });
    });
});
