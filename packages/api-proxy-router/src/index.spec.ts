/*
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { expect } from 'chai';
import 'mocha';
import * as mod from './index.js';
// tslint:disable:no-unused-expression
describe('index.ts', (): void => {
    it('should export correct modules', (): void => {
        expect(mod.createApiProxyRouter).to.not.be.undefined;
    });
});
