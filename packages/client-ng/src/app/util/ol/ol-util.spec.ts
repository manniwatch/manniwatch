/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { fromLonLat } from 'ol/proj';
import { OlUtil, TrapezeCoord } from '.';

describe('util/ol/ol-util', (): void => {
    describe('OlUtil', (): void => {
        describe('convertArcMSToCoordinate()', (): void => {
            it('should not throw on [0,0] coordinates', (): void => {
                expect(
                    OlUtil.convertArcMSToCoordinate({
                        lat: 0,
                        lon: 0,
                    })
                ).toBeTruthy();
            });
            it('should throw an error if invalid coordinate format is provided', (): void => {
                expect((): void => {
                    OlUtil.convertArcMSToCoordinate({
                        lat: 0,
                        longitude: 0,
                    } as any);
                }).toThrowError('Invalid coordinates');
            });
            it('should convert coordinates with latitude and longitude properties', (): void => {
                expect(
                    OlUtil.convertArcMSToCoordinate({
                        latitude: 3600000,
                        longitude: 3600000,
                    })
                ).toEqual(fromLonLat([1, 1]));
            });
        });
        describe('createStyleByType(feature)', (): void => {
            it('should return same result for stopPoint and point', (): void => {
                expect(OlUtil.createStyleByType('stopPoint')).toEqual(OlUtil.createStyleByType('stop'));
            });
        });
    });
});
