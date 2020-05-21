/*!
 * Source https://github.com/manniwatch/manniwatch Package: pb-converter
 */

import { expect } from 'chai';
import 'mocha';
import * as testObject from './convert-location';
describe('convert-location.ts', (): void => {
    describe('convertLocation(location)', (): void => {
        it('should convert location with lat and lon provided', (): void => {
            expect(testObject.convertLocation({ lat: 92, lon: 28 }))
                .to.deep.equal({ latitude: 92, longitude: 28 });
        });
        it('should convert location with latitude and longitude provided', (): void => {
            expect(testObject.convertLocation({ latitude: 192, longitude: 328 }))
                .to.deep.equal({ latitude: 192, longitude: 328 });
        });
        [
            'lat',
            'latitude',
            'longitude',
            'lon',
        ].forEach((key: string): void => {
            it(`should return undefined if only "${key}" is provided`, (): void => {
                const testObj: any = {};
                testObj[key] = 2939;
                expect(testObject.convertLocation(testObj))
                    .to.deep.equal(undefined);
            });
        });
    });
});
