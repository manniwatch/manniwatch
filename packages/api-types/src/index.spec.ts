/*
 * Package @manniwatch/api-types
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/api-types
 */

import { expect } from 'chai';
import 'mocha';
import * as index from './index.js';

describe('index', (): void => {
    it('should contain FlowApiValidator', (): void => {
        expect(index).to.not.equal(undefined);
    });
});
