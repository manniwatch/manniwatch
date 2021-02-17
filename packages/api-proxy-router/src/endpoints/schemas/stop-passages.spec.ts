/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { StopMode } from '@manniwatch/api-types';
import Ajv, { ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { STOP_PASSAGES_SCHEMA } from './stop-passages';

const validOptions: StopMode[] = ['departure', 'arrival'];
const validTestNumbers: (number | string)[] = [3, '2', '0', '+4'];
const invalidTestNumbers: (number | string)[] = [-1, '-2'];
// tslint:disable-next-line:no-unused-expression
describe('endpoints/schema/stop-passages', (): void => {
    let ajvInstance: Ajv;
    let validator: ValidateFunction;
    beforeEach('setup Ajv and validation function', (): void => {
        ajvInstance = new Ajv({ strict: true });
        validator = ajvInstance.compile(STOP_PASSAGES_SCHEMA);
    });
    describe('STOP_PASSAGES_SCHEMA', (): void => {
        describe('$root.mode', (): void => {
            validOptions.forEach((mode: StopMode): void => {
                it(`should accept '${mode}'`, (): void => {
                    expect(validator({
                        mode
                    })).to.be.true;
                });
            });
        });
        describe('$root.timeFrame', (): void => {
            validTestNumbers.forEach((testValue: any): void => {
                it(`should pass for ${testValue}`, (): void => {
                    expect(validator({
                        timeFrame: testValue,
                    }), 'schema should be valid').to.be.true;
                });
            });
            invalidTestNumbers.forEach((testValue: any): void => {
                it(`should pass for ${testValue}`, (): void => {
                    expect(validator({
                        timeFrame: testValue,
                    }), 'schema should not be valid').to.be.false;
                });
            });
        });
        describe('$root.startTime', (): void => {
            validTestNumbers.forEach((testValue: any): void => {
                it(`should pass for ${testValue}`, (): void => {
                    expect(validator({
                        startTime: testValue,
                    }), 'schema should be valid').to.be.true;
                });
            });
            invalidTestNumbers.forEach((testValue: any): void => {
                it(`should pass for ${testValue}`, (): void => {
                    expect(validator({
                        startTime: testValue,
                    }), 'schema should not be valid').to.be.false;
                });
            });
        });
        it(`should reject unknown properties`, (): void => {
            expect(validator({
                unknown: 'property',
            }), 'schema should not be valid').to.be.false;
        });
    });
});
