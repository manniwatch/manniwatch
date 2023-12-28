/*
 * Package @manniwatch/client-types
 * Source https://manniwatch.github.io/manniwatch/
 */

import { expect } from 'chai';
import 'mocha';
import * as index from './index.js';

describe('index', (): void => {
    it('should contain FlowApiValidator', (): void => {
        expect(index).to.not.equal(undefined);
    });
});
