/**
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import { type StopMode } from '@manniwatch/api-types';
import Ajv, { type ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { STOP_PASSAGES_SCHEMA } from './stop-passages.js';

const validOptions: StopMode[] = ['departure', 'arrival'];
const validTestNumbers: (number | string)[] = [3, '2', '0', '+4'];
const invalidTestNumbers: (number | string)[] = [-1, '-2'];

/* eslint-disable mocha/no-setup-in-describe */
describe('endpoints/schema/stop-passages', function (): void {
    let ajvInstance: Ajv;
    let validator: ValidateFunction;

    beforeEach('setup Ajv and validation function', function (): void {
        ajvInstance = new Ajv({ strict: true });
        validator = ajvInstance.compile(STOP_PASSAGES_SCHEMA);
    });

    describe('STOP_PASSAGES_SCHEMA', function (): void {
        describe('$root.mode', function (): void {
            validOptions.forEach((mode: StopMode): void => {
                it(`should accept '${mode}'`, function (): void {
                    expect(
                        validator({
                            mode,
                        })
                    ).to.be.true;
                });
            });
        });

        describe('$root.timeFrame', function (): void {
            validTestNumbers.forEach((testValue: string | number): void => {
                it(`should pass for ${testValue}`, function (): void {
                    expect(
                        validator({
                            timeFrame: testValue,
                        }),
                        'schema should be valid'
                    ).to.be.true;
                });
            });
            invalidTestNumbers.forEach((testValue: string | number): void => {
                it(`should reject for ${testValue}`, function (): void {
                    expect(
                        validator({
                            timeFrame: testValue,
                        }),
                        'schema should not be valid'
                    ).to.be.false;
                });
            });
        });

        describe('$root.startTime', function (): void {
            validTestNumbers.forEach((testValue: string | number): void => {
                it(`should pass for ${testValue}`, function (): void {
                    expect(
                        validator({
                            startTime: testValue,
                        }),
                        'schema should be valid'
                    ).to.be.true;
                });
            });
            invalidTestNumbers.forEach((testValue: string | number): void => {
                it(`should reject for ${testValue}`, function (): void {
                    expect(
                        validator({
                            startTime: testValue,
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
