/**
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import { type StopMode } from '@manniwatch/api-types';
import Ajv, { type ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { STOP_MODE_SCHEMA } from './stop-mode.js';

const validOptions: StopMode[] = ['departure', 'arrival'];

/* eslint-disable mocha/no-setup-in-describe */
describe('endpoints/schema/stop-mode', function (): void {
    let ajvInstance: Ajv;
    let validator: ValidateFunction;

    beforeEach('setup Ajv and validation function', function (): void {
        ajvInstance = new Ajv({ strict: true });
        validator = ajvInstance.compile(STOP_MODE_SCHEMA);
    });

    describe('STOP_MODE_SCHEMA', function (): void {
        validOptions.forEach((mode: StopMode): void => {
            it(`should accept '${mode}'`, function (): void {
                expect(validator(mode)).to.be.true;
            });
        });

        it('should reject empty string', function (): void {
            // tslint:disable-next-line:no-unused-expression
            expect(validator(''), 'schema should not be valid').to.be.false;
        });
    });
});
