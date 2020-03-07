/*!
 * Source https://github.com/manniwatch/trapeze Package: trapeze-vehicle-location-diff
 */

import { expect } from 'chai';
import 'mocha';
import * as instance from './index';

describe('index.ts', (): void => {
    describe('index exports', (): void => {
        // tslint:disable-next-line:no-unused-expression
        expect(instance).to.not.be.undefined;
        // tslint:disable-next-line:no-unused-expression
        expect(instance.VehicleDiffHandler).to.not.be.undefined;
    });
});
