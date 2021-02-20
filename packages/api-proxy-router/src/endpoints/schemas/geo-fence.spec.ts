/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { IBoundingBox } from '@manniwatch/api-client';
import Ajv, { ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { GEO_FENCE_SCHEMA } from './geo-fence';

const validCoordinates: TestIBoundingBox[] = [
    { bottom: '-1000', left: '-1000', right: '1000', top: '1000' },
    { bottom: '-1000', left: '-1000', right: '1000', top: '-500' },
    { bottom: '-1000', left: '-1000', right: '-500', top: '1000' },
    { bottom: '500', left: '-1000', right: '1000', top: '1000' },
    { bottom: '-1000', left: '500', right: '1000', top: '1000' },
];
type TestIBoundingBox = { [key in keyof IBoundingBox]: string };
describe('endpoints/schema/geo-fence.ts', (): void => {
    let ajvInstance: Ajv;
    beforeEach('setup Ajv and validation function', (): void => {
        ajvInstance = new Ajv({ strict: true });
    });
    describe('GEO_FENCE_SCHEMA', (): void => {
        const parameters: string[] = ['top', 'bottom', 'right', 'left'];
        const combinations: Partial<TestIBoundingBox>[] = [{}];
        const paramMap: TestIBoundingBox = { bottom: '-1000', left: '-1000', right: '1000', top: '1000' };
        for (let i: number = 0; i < 4; i++) {
            const box1: Partial<TestIBoundingBox> = {};
            box1[parameters[i]] = paramMap[parameters[i]];
            combinations.push(box1);
            for (let j: number = 0; j < 4; j++) {
                if (i === j) {
                    continue;
                }
                const box2: Partial<TestIBoundingBox> = {};
                box2[parameters[i]] = paramMap[parameters[i]];
                box2[parameters[j]] = paramMap[parameters[j]];
                combinations.push(box2);
                for (let k: number = 0; k < 4; k++) {
                    if (i === k || j === k) {
                        continue;
                    }
                    const box3: Partial<TestIBoundingBox> = {};
                    box3[parameters[i]] = paramMap[parameters[i]];
                    box3[parameters[j]] = paramMap[parameters[j]];
                    box3[parameters[k]] = paramMap[parameters[k]];
                    combinations.push(box3);
                }
            }
        }
        let ajvValidationFunction: ValidateFunction;
        beforeEach('setup Ajv and validation function', (): void => {
            ajvValidationFunction = ajvInstance.compile(GEO_FENCE_SCHEMA);
        });
        describe('reject', (): void => {
            combinations.forEach((testBoundingBox: Partial<TestIBoundingBox>): void => {
                it('should reject: ' + JSON.stringify(testBoundingBox), (): void => {
                    // tslint:disable-next-line:no-unused-expression
                    expect(ajvValidationFunction(testBoundingBox), 'schema should not be valid').to.be.false;
                });
            });
        });
        describe('resolve', (): void => {
            validCoordinates.forEach((testBoundingBox: TestIBoundingBox): void => {
                it('should resolve: ' + JSON.stringify(testBoundingBox), (): void => {
                    // tslint:disable-next-line:no-unused-expression
                    expect(ajvValidationFunction(testBoundingBox), 'schema should not be valid').to.be.true;
                });
            });
        });
    });
});
