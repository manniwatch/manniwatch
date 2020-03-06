/*!
 * Source https://github.com/donmahallem/TrapezeApiTypes
 */

/*!
 * Source https://github.com/donmahallem/TrapezeApiClientNode
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
