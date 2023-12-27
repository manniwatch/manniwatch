/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { expect } from 'chai';
import 'mocha';
import { IFileConfig } from './config';
import { validateConfigFile } from './validate-file-config';

describe('./shared/validate-file-config.ts', (): void => {
    it('should validate with center provided', async (): Promise<void> => {
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
    it('should validate with no center provided', async (): Promise<void> => {
        const testObject: any = {
            map: {},
        };
        expect(await validateConfigFile(testObject)).to.equal(true);
    });
    describe('url', (): void => {
        it('should accept a string', async (): Promise<void> => {
            const testObject: IFileConfig = {
                map: {
                    url: 'any url',
                },
            };
            expect(await validateConfigFile(testObject)).to.equal(true);
        });
        it('should accept an array', async (): Promise<void> => {
            const testObject: IFileConfig = {
                map: {
                    url: ['any url'],
                },
            };
            expect(await validateConfigFile(testObject)).to.equal(true);
        });
    });
});
