/*
 * Package @manniwatch/vehicle-cache
 * Source https://manniwatch.github.io/manniwatch/
 */

import { expect } from 'chai';
import 'mocha';
import * as instance from './index.js';

describe('index.ts', (): void => {
    describe('index exports', (): void => {
        // tslint:disable-next-line:no-unused-expression
        expect(instance).to.not.be.undefined;
        // tslint:disable-next-line:no-unused-expression
        expect(instance.intervalVehicleLocationPoll).to.not.be.undefined;
    });
});
