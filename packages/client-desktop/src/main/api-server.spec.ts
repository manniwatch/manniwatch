/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { expect } from 'chai';
import 'mocha';
import * as index from './app';

describe('index', (): void => {
    it('should contain FlowApiValidator', (): void => {
        expect(index).to.not.equal(undefined);
    });
});
