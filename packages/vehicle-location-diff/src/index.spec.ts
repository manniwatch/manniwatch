// Source https://github.com/manniwatch/manniwatch Package: vehicle-location-diff

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expect } from 'chai';
import 'mocha';
import * as instance from './index';

describe('index.ts', (): void => {
    describe('index exports', (): void => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(instance).to.not.be.undefined;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(instance.VehicleDiffHandler).to.not.be.undefined;
    });
});
