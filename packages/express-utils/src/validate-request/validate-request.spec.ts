/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/express-utils
*/

import { expect } from 'chai';
import { RequestHandler } from 'express';
import 'mocha';
import { Done } from 'mocha';
import { validateRequest } from './validate-request';

// tslint:disable:no-unused-expression
describe('validate-request/validate-request.ts', (): void => {
    describe('validateRequest', (): void => {
        it('should pass if empty hash is provided', (done: Done): void => {
            const validationResult: RequestHandler = validateRequest({});
            validationResult({} as any, {} as any, (res?: any): void => {
                expect(res).to.be.undefined;
                done();
            });
        });
    });
});
