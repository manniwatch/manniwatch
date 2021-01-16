/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/vehicle-location-diff
*/

import { expect } from 'chai';
import 'mocha';
import * as instance from './index';

describe('index.ts', (): void => {
    describe('index exports', (): void => {
        expect(instance).to.not.be.undefined;
        expect(instance.VehicleDiffHandler).to.not.be.undefined;
    });
});
