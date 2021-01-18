/*!
 * Source https://github.com/manniwatch/manniwatch Package: express-utils
 */

import { expect } from 'chai';
import { RequestHandler } from 'express';
import 'mocha';
import { Done } from 'mocha';
import { ServerError } from '../server-error';
import { validateRequest, ValidationSchemas } from './validate-request';

const checkKeys: string[] = ['query', 'params', 'body'];
// tslint:disable:no-unused-expression
describe('validate-request/validate-request.ts', (): void => {
    describe('validateRequest', (): void => {
        it('should pass if empty hash is provided', (done: Done): void => {
            const validationResult: RequestHandler = validateRequest({ properties: {} });
            validationResult({} as any, {} as any, (res?: any): void => {
                expect(res).to.be.undefined;
                done();
            });
        });
        checkKeys.forEach((key: string): void => {
            it(`should check property '${key}' correctly`, (done: Done): void => {
                const configObj: ValidationSchemas = {
                    properties: {},
                };
                configObj.properties[key] = {
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
                };
                const validationResult: RequestHandler = validateRequest(configObj);
                validationResult({
                    [key]: { top: '123', bottom: '-123' },
                } as any, {} as any, (res?: any): void => {
                    expect(res).to.be.undefined;
                    done();
                });
            });
            it(`should reject property '${key}' correctly`, (done: Done): void => {
                const configObj: ValidationSchemas = {
                    properties: {},
                };
                configObj.properties[key] = {
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
                };
                const validationResult: RequestHandler = validateRequest(configObj);
                validationResult({
                    [key]: { top: 'asdf', bottom: '-123' },
                } as any, {} as any, (res?: any): void => {
                    expect(res).to.not.be.undefined;
                    expect(res).to.be.instanceOf(ServerError);
                    done();
                });
            });
        });
    });
});
