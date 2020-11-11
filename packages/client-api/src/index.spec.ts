/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { expect } from 'chai';
import 'mocha';
import * as index from './index';

describe('index', (): void => {
    it('should contain ApiService', (): void => {
        expect(index).to.not.equal(undefined);
    });
});
