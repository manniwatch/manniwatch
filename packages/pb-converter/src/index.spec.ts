/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { expect } from 'chai';
import 'mocha';
import * as index from './index';

describe('index', (): void => {
    it('should contain convertVehicleLocation', (): void => {
        expect(index.convertVehicleLocation).to.not.equal(undefined);
    });
});
