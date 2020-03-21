/*!
 * Source https://github.com/manniwatch/manniwatch Package: express-utils
 */

import { expect } from 'chai';
import { validate, ValidatorResult } from 'jsonschema';
import 'mocha';
import { ServerError } from '../server-error';
import { convertValidationError } from './convert-validation-error';

describe('validate-request/convert-validation-error.ts', (): void => {
    describe('convertValidationError', (): void => {
        ['query parameter', 'path parameter']
            .forEach((param: string): void => {
                it('should report expected array', (): void => {
                    const validationResult: ValidatorResult = validate({}, {
                        type: 'array',
                    });
                    // tslint:disable-next-line:no-unused-expression
                    expect(validationResult.valid).to.be.false;
                    const testError: ServerError = convertValidationError(validationResult.errors[0], param);
                    expect(testError).to.be.instanceOf(ServerError, 'should be a server error');
                    expect(testError.message).to.equal('Invalid ' + param + ' type');
                });
                it('should report missing top parameter', (): void => {
                    const validationResult: ValidatorResult = validate({}, {
                        properties: {
                            bottom: {
                                id: 'bottom',
                                pattern: '^[\\+\\-]?\\d+$',
                                type: 'string',
                            },
                            top: {
                                id: 'top',
                                pattern: '^[\\+\\-]?\\d+$',
                                type: 'string',
                            },
                        },
                        required: ['top', 'bottom'],
                        type: 'object',
                    });
                    // tslint:disable-next-line:no-unused-expression
                    expect(validationResult.valid).to.be.false;
                    const testError: ServerError = convertValidationError(validationResult.errors[0], param);
                    expect(testError).to.be.instanceOf(ServerError, 'should be a server error');
                    expect(testError.message).to.equal('Requires ' + param + ' parameter \'top\'');
                });
                it('should report invalid param', (): void => {
                    const validationResult: ValidatorResult = validate({
                        bottom: '-2992a',
                    }, {
                        properties: {
                            bottom: {
                                pattern: '^[\\+\\-]?\\d+$',
                                type: 'string',
                            },
                        },
                        required: ['bottom'],
                        type: 'object',
                    });
                    // tslint:disable-next-line:no-unused-expression
                    expect(validationResult.valid).to.be.false;
                    const testError: ServerError = convertValidationError(validationResult.errors[0], param);
                    expect(testError).to.be.instanceOf(ServerError, 'should be a server error');
                    expect(testError.message).to.equal('Invalid ' + param + ' pattern');
                });
                it('should report invalid param', (): void => {
                    const validationResult: ValidatorResult = validate({
                        bottom: '-2992a',
                    }, {
                        properties: {
                            bottom: {
                                type: 'array',
                            },
                        },
                        required: ['bottom'],
                        type: 'object',
                    });
                    // tslint:disable-next-line:no-unused-expression
                    expect(validationResult.valid).to.be.false;
                    const testError: ServerError = convertValidationError(validationResult.errors[0], param);
                    expect(testError).to.be.instanceOf(ServerError, 'should be a server error');
                    expect(testError.message).to.equal('Invalid ' + param + ' type');
                });
            });
    });
});
