/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { CoordinateFormat } from '@manniwatch/client-types';
import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { CONFIG_SCHEMA } from './config';

const getAjvError = (errors?: null | ErrorObject[]): string | undefined => {
    if (errors) {
        return errors[0].message;
    }
    return undefined;
};
describe('./shared/config.ts', (): void => {
    [true, false].forEach((useDefaults: boolean): void => {
        describe(`test with useDefaults ${useDefaults ? 'on' : 'off'}`, (): void => {
            let ajv: Ajv;
            let fn: ValidateFunction;
            beforeEach('initialize Ajv', (): void => {
                ajv = new Ajv({ useDefaults, logger: console });
                fn = ajv.compile(CONFIG_SCHEMA);
            });
            it('should validate with center provided', (): void => {
                const testObject: any = {
                    map: {
                        center: {
                            lat: 0,
                            lon: 0,
                        },
                    },
                };
                expect(fn(testObject)).to.equal(true, getAjvError(fn.errors));
                expect(testObject).to.deep.equal({
                    map: {
                        center: {
                            ...useDefaults ? { format: CoordinateFormat.ARC_MILISECOND } : {},
                            lat: 0,
                            lon: 0,
                        },
                    },
                });
            });
            it('should validate with no center provided', (): void => {
                const testObject: any = {
                    map: {
                    },
                };
                expect(fn(testObject)).to.equal(true, getAjvError(fn.errors));
                expect(testObject).to.deep.equal({
                    map: {
                        ...useDefaults ? {
                            center: {
                                format: CoordinateFormat.ARC_MILISECOND,
                                lat: 0,
                                lon: 0,
                            },
                        } : {},
                    },
                });
            });
        });
    });
});
