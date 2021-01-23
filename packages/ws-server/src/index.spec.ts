/*!
 * Source https://github.com/manniwatch/manniwatch Package: ws-server
 */

import { expect } from 'chai';
import 'mocha';
import * as mod from './index';
// tslint:disable:no-unused-expression
describe('index.ts', (): void => {
    it('should export correct modules', (): void => {
        expect(mod.ManniWatchWsServer).to.not.be.undefined;
    });
});
