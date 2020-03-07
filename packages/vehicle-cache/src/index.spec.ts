/*!
 * Source https://github.com/manniwatch/manniwatch Package: trapeze-api-proxy-router
 */

import { expect } from 'chai';
import 'mocha';
import * as instance from './index';

describe('index.ts', (): void => {
    describe('index exports', (): void => {
        // tslint:disable-next-line:no-unused-expression
        expect(instance).to.not.be.undefined;
        // tslint:disable-next-line:no-unused-expression
        expect(instance.TrapezeVehicleCache).to.not.be.undefined;
    });
});
