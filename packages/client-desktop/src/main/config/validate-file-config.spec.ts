/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { expect } from 'chai';
import 'mocha';
import { IFileConfig } from './config';
import { validateConfigFile } from './validate-file-config';

describe('./shared/validate-file-config.ts', (): void => {
    it('should validate with center provided', (): void => {
        const testObject: any = {
            map: {
                center: {
                    lat: 0,
                    lon: 0,
                },
            },
        };
        expect(validateConfigFile(testObject)).to.equal(true);
    });
    it('should validate with no center provided', (): void => {
        const testObject: any = {
            map: {
            },
        };
        expect(validateConfigFile(testObject)).to.equal(true);
    });
    describe('url', (): void => {
        it('should accept a string', (): void => {
            const testObject: IFileConfig = {
                map: {
                    url: 'any url',
                },
            };
            expect(validateConfigFile(testObject)).to.equal(true);
        });
        it('should accept an array', (): void => {
            const testObject: IFileConfig = {
                map: {
                    url: ['any url'],
                },
            };
            expect(validateConfigFile(testObject)).to.equal(true);
        });
    });
});
