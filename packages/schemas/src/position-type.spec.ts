/**
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import { PositionType } from '@manniwatch/api-types';
import Ajv, { ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { POSITION_TYPE_SCHEMA } from './position-type.js';

const validOptions: PositionType[] = ['RAW', 'CORRECTED'];

/* eslint-disable mocha/no-setup-in-describe */
describe('endpoints/schema/position-type', function (): void {
    let ajvInstance: Ajv;
    let validator: ValidateFunction;

    beforeEach('setup Ajv and validation function', function (): void {
        ajvInstance = new Ajv({ strict: true });
        validator = ajvInstance.compile(POSITION_TYPE_SCHEMA);
    });

    describe('POSITION_TYPE_SCHEMA', function (): void {
        validOptions.forEach((posType: PositionType): void => {
            it(`should accept '${posType}'`, function (): void {
                expect(validator(posType)).to.be.true;
            });
        });

        it('should reject empty string', function (): void {
            // tslint:disable-next-line:no-unused-expression
            expect(validator(''), 'schema should not be valid').to.be.false;
        });
    });
});
