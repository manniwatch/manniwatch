/**
 * Package @manniwatch/client-desktop
 * Source https://manniwatch.github.io/manniwatch/
 */

import { expect } from 'chai';
import 'mocha';
import { IFileConfig } from './config';
import { validateConfigFile } from './validate-file-config';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('./shared/validate-file-config.ts', function (): void {
    it('should validate with center provided', async function (): Promise<void> {
        const testObject: any = {
            map: {
                center: {
                    lat: 0,
                    lon: 0,
                },
            },
        };
        expect(await validateConfigFile(testObject)).to.equal(true);
    });

    it('should validate with no center provided', async function (): Promise<void> {
        const testObject: any = {
            map: {},
        };
        expect(await validateConfigFile(testObject)).to.equal(true);
    });

    describe('url', function (): void {
        it('should accept a string', async function (): Promise<void> {
            const testObject: IFileConfig = {
                map: {
                    url: 'any url',
                },
            };
            expect(await validateConfigFile(testObject)).to.equal(true);
        });

        it('should accept an array', async function (): Promise<void> {
            const testObject: IFileConfig = {
                map: {
                    url: ['any url'],
                },
            };
            expect(await validateConfigFile(testObject)).to.equal(true);
        });
    });
});
