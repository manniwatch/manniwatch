/**
 * Package @manniwatch/api-client
 * Source https://manniwatch.github.io/manniwatch/
 */

import { expect } from 'chai';
import 'mocha';
import { Util } from './util.js';

/* eslint-disable mocha/no-setup-in-describe */
describe('util.ts', function (): void {
    describe('Util', function (): void {
        describe('transformSettingsBody', function (): void {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const testObjects: any[] = [
                { test: true },
                { test: false },
                { test: 'any value' },
                {
                    nested: {
                        value: true,
                    },
                },
            ];
            const prefixes: string[] = ['', 'a lot of', 'javascript_variable = '];
            const suffixes: string[] = [';', ''];
            testObjects.forEach((testObject: unknown): void => {
                describe(`used with testObject: ${JSON.stringify(testObject)}`, function (): void {
                    prefixes.forEach((prefix: string): void => {
                        suffixes.forEach((suffix: string): void => {
                            it(`should pass with prefix "${prefix}" and suffix "${suffix}"`, function (): void {
                                const testBody: string = prefix + JSON.stringify(testObject) + suffix;
                                expect(Util.transformSettingsBody(testBody)).to.deep.equal(testObject);
                            });
                        });
                    });
                });
            });

            it('should throw an error if no valid data is provided', function (): void {
                expect((): void => {
                    Util.transformSettingsBody('{breaks!}');
                }).to.throw(SyntaxError);
            });

            it('should throw an error if no valid data is provided 2', function (): void {
                expect((): void => {
                    Util.transformSettingsBody('invalid data');
                }).to.throw('non valid response body');
            });
        });
    });
});
