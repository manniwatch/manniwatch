/**
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import Ajv, { ValidateFunction } from 'ajv';
import { expect } from 'chai';
import 'mocha';
import { GEO_FENCE_SCHEMA, IGeoFenceSchema } from './geo-fence.js';

const validCoordinates: TestIBoundingBox[] = [
    { bottom: '-1000', left: '-1000', right: '1000', top: '1000' },
    { bottom: '-1000', left: '-1000', right: '1000', top: '-500' },
    { bottom: '-1000', left: '-1000', right: '-500', top: '1000' },
    { bottom: '500', left: '-1000', right: '1000', top: '1000' },
    { bottom: '-1000', left: '500', right: '1000', top: '1000' },
    { bottom: '-1000', left: '500', right: 1000, top: 1000 },
];
type TestIBoundingBox = { [key in keyof IGeoFenceSchema]: string | number };
/* eslint-disable mocha/no-setup-in-describe */
describe('geo-fence.ts', function (): void {
    let ajvInstance: Ajv;

    beforeEach('setup Ajv and validation function', function (): void {
        ajvInstance = new Ajv({ strict: true });
    });

    describe('GEO_FENCE_SCHEMA', function (): void {
        const parameters: string[] = ['top', 'bottom', 'right', 'left'];
        const combinations: Partial<TestIBoundingBox>[] = [{}];
        const paramMap: TestIBoundingBox = { bottom: '-1000', left: '-1000', right: '1000', top: '1000' };
        for (let i = 0; i < 4; i++) {
            const box1: Partial<TestIBoundingBox> = {};
            box1[parameters[i]] = paramMap[parameters[i]] as unknown;
            combinations.push(box1);
            for (let j = 0; j < 4; j++) {
                if (i === j) {
                    continue;
                }
                const box2: Partial<TestIBoundingBox> = {};
                box2[parameters[i]] = paramMap[parameters[i]] as unknown;
                box2[parameters[j]] = paramMap[parameters[j]] as unknown;
                combinations.push(box2);
                for (let k = 0; k < 4; k++) {
                    if (i === k || j === k) {
                        continue;
                    }
                    const box3: Partial<TestIBoundingBox> = {};
                    box3[parameters[i]] = paramMap[parameters[i]] as unknown;
                    box3[parameters[j]] = paramMap[parameters[j]] as unknown;
                    box3[parameters[k]] = paramMap[parameters[k]] as unknown;
                    combinations.push(box3);
                }
            }
        }
        let ajvValidationFunction: ValidateFunction;

        beforeEach('setup Ajv and validation function', function (): void {
            ajvValidationFunction = ajvInstance.compile(GEO_FENCE_SCHEMA);
        });

        describe('reject', function (): void {
            combinations.forEach((testBoundingBox: Partial<TestIBoundingBox>): void => {
                it(`should reject: ${JSON.stringify(testBoundingBox)}`, function (): void {
                    // tslint:disable-next-line:no-unused-expression
                    expect(ajvValidationFunction(testBoundingBox), 'schema should not be valid').to.be.false;
                });
            });
        });

        describe('resolve', function (): void {
            validCoordinates.forEach((testBoundingBox: TestIBoundingBox): void => {
                it(`should resolve: ${JSON.stringify(testBoundingBox)}`, function (): void {
                    // tslint:disable-next-line:no-unused-expression
                    expect(ajvValidationFunction(testBoundingBox), 'schema should not be valid').to.be.true;
                });
            });
        });
    });
});
