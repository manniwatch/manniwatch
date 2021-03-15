/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-types
 */

import { expect } from 'chai';
import 'mocha';
import { convertTo, CoordinateFormat } from './map-coordinate';

describe('map-coordinate', (): void => {
    describe('expect ARC_MILISECOND as default', (): void => {
        it('should convert to ARC_MILISECOND', (): void => {
            expect(convertTo({ lat: 9293, lon: 2939 }, CoordinateFormat.ARC_MILISECOND)).to.deep.equal({
                format: CoordinateFormat.ARC_MILISECOND,
                lat: 9293,
                lon: 2939,
            }, 'format should be arc milisecond');
        });
        it('should convert to ARC_SECOND', (): void => {
            expect(convertTo({ lat: 9293, lon: 2939 }, CoordinateFormat.ARC_SECOND)).to.deep.equal({
                format: CoordinateFormat.ARC_SECOND,
                lat: 9.293,
                lon: 2.939,
            }, 'format should be arc second');
        });
    });
    it('should convert ARC_HOUR to ARC_SECOND', (): void => {
        expect(convertTo({ format: CoordinateFormat.ARC_HOUR, lat: 9293, lon: 2939 }, CoordinateFormat.ARC_SECOND)).to.deep.equal({
            format: CoordinateFormat.ARC_SECOND,
            lat: 9293 * 3600,
            lon: 2939 * 3600,
        }, 'format should be arc second');
    });
    it('should convert ARC_MINUTE to ARC_SECOND', (): void => {
        expect(convertTo({ format: CoordinateFormat.ARC_MINUTE, lat: 9293, lon: 2939 }, CoordinateFormat.ARC_SECOND)).to.deep.equal({
            format: CoordinateFormat.ARC_SECOND,
            lat: 9293 * 60,
            lon: 2939 * 60,
        }, 'format should be arc second');
    });
    it('should convert ARC_MINUTE to ARC_MILISECOND', (): void => {
        expect(convertTo({ format: CoordinateFormat.ARC_MINUTE, lat: 9293, lon: 2939 }, CoordinateFormat.ARC_MILISECOND)).to.deep.equal({
            format: CoordinateFormat.ARC_MILISECOND,
            lat: 9293 * 60000,
            lon: 2939 * 60000,
        }, 'format should be arc second');
    });
    it('should convert ARC_MILISECOND to ARC_MINUTE', (): void => {
        expect(convertTo({ format: CoordinateFormat.ARC_MILISECOND, lat: 9293, lon: 2939 }, CoordinateFormat.ARC_MINUTE)).to.deep.equal({
            format: CoordinateFormat.ARC_MINUTE,
            lat: 9293 / 60000,
            lon: 2939 / 60000,
        }, 'format should be arc second');
    });
});
