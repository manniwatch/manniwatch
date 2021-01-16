/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/api-proxy-router
*/

import { expect } from 'chai';
import 'mocha';
import * as mod from './index';
// tslint:disable:no-unused-expression
describe('index.ts', (): void => {
    it('should export correct modules', (): void => {
        expect(mod.createApiProxyRouter).to.not.be.undefined;
    });
});
