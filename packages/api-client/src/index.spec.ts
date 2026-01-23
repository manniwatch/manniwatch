/**
 * Package @manniwatch/api-client
 * Source https://manniwatch.github.io/manniwatch/
 */

import { expect } from 'chai';
import 'mocha';
import * as instance from './index.js';

/* eslint-disable mocha/no-setup-in-describe */
describe('index.ts', function (): void {
    describe('index exports', function (): void {
        expect(instance).to.not.be.undefined;
        expect(instance.ManniWatchApiClient).to.not.be.undefined;
        expect(instance.Util).to.not.be.undefined;
    });
});
