/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { PositionType } from '@manniwatch/api-types';
import Ajv, { ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { POSITION_TYPE_SCHEMA } from './position-type';

const validOptions: PositionType[] = ['RAW', 'CORRECTED'];
describe('endpoints/schema/position-type', (): void => {
    let ajvInstance: Ajv;
    let validator: ValidateFunction;
    beforeEach('setup Ajv and validation function', (): void => {
        ajvInstance = new Ajv({ strict: true });
        validator = ajvInstance.compile(POSITION_TYPE_SCHEMA);
    });
    describe('POSITION_TYPE_SCHEMA', (): void => {
        validOptions.forEach((posType: PositionType): void => {
            it(`should accept '${posType}'`, (): void => {
                expect(validator(posType)).to.be.true;
            });
        });
        it('should reject empty string', (): void => {
            // tslint:disable-next-line:no-unused-expression
            expect(validator(''), 'schema should not be valid').to.be.false;
        });
    });
});
