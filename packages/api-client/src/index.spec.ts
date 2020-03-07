/*!
 * Source https://github.com/manniwatch/TrapezeApiTypes
 */

/*!
 * Source https://github.com/manniwatch/TrapezeApiClientNode
 */

import { expect } from 'chai';
import 'mocha';
import * as instance from './index';

describe('index.ts', (): void => {
    describe('index exports', (): void => {
        // tslint:disable-next-line:no-unused-expression
        expect(instance).to.not.be.undefined;
        // tslint:disable-next-line:no-unused-expression
        expect(instance.TrapezeApiClient).to.not.be.undefined;
    });
});
