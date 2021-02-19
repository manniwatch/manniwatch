/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { StopMode } from '@manniwatch/api-types';
import Ajv, { ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { STOP_MODE_SCHEMA } from './stop-mode';

const validOptions: StopMode[] = ['departure', 'arrival'];

// tslint:disable:no-unused-expression
describe('endpoints/schema/stop-mode', (): void => {
    let ajvInstance: Ajv;
    let validator: ValidateFunction;
    beforeEach('setup Ajv and validation function', (): void => {
        ajvInstance = new Ajv({ strict: true });
        validator = ajvInstance.compile(STOP_MODE_SCHEMA);
    });
    describe('STOP_MODE_SCHEMA', (): void => {
        validOptions.forEach((mode: StopMode): void => {
            it(`should accept '${mode}'`, (): void => {
                expect(validator(mode)).to.be.true;
            });
        });
        it('should reject empty string', (): void => {
            // tslint:disable-next-line:no-unused-expression
            expect(validator(''), 'schema should not be valid').to.be.false;
        });
    });
});
