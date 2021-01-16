/*
Source: https://github.com/manniwatch/manniwatch
Package: @manniwatch/api-client
*/

import { expect } from 'chai';
import 'mocha';
import { Util } from './util';

describe('util.ts', (): void => {
    describe('Util', (): void => {
        describe('transformSettingsBody', (): void => {
            const testObjects: any[] = [
                { test: true },
                { test: false },
                { test: 'any value' }, {
                    nested: {
                        value: true,
                    },
                },
            ];
            const prefixes: string[] = [
                '',
                'a lot of',
                'javascript_variable = ',
            ];
            const suffixes: string[] = [
                ';',
                '',
            ];
            testObjects.forEach((testObject: any): void => {
                describe('used with testObject: ' + JSON.stringify(testObject), (): void => {
                    prefixes.forEach((prefix: string): void => {
                        suffixes.forEach((suffix: string): void => {
                            it('should pass with prefix "' + prefix + '" and suffix "' + suffix + '"', (): void => {
                                const testBody: string = prefix + JSON.stringify(testObject) + suffix;
                                expect(Util.transformSettingsBody(testBody)).to.deep.equal(testObject);
                            });
                        });
                    });
                });
            });
            it('should throw an error if no valid data is provided', (): void => {
                expect((): void => {
                    Util.transformSettingsBody('{breaks!}');
                }).to.throw('Unexpected token b in JSON at position 1');
            });
            it('should throw an error if no valid data is provided', (): void => {
                expect((): void => {
                    Util.transformSettingsBody('invalid data');
                }).to.throw('non valid response body');
            });
        });
    });
});
