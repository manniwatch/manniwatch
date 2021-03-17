/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-client
 */

import { expect } from 'chai';
import 'mocha';
import * as instance from './index';

// tslint:disable:no-unused-expression
describe('index.ts', (): void => {
    describe('index exports', (): void => {
        expect(instance).to.not.be.undefined;
        expect(instance.ManniWatchApiClient).to.not.be.undefined;
        expect(instance.Util).to.not.be.undefined;
    });
});
