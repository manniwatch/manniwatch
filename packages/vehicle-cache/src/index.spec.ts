/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/vehicle-cache
*/

import { expect } from 'chai';
import 'mocha';
import * as instance from './index';

describe('index.ts', (): void => {
    describe('index exports', (): void => {
        // tslint:disable-next-line:no-unused-expression
        expect(instance).to.not.be.undefined;
        // tslint:disable-next-line:no-unused-expression
        expect(instance.intervalVehicleLocationPoll).to.not.be.undefined;
    });
});
