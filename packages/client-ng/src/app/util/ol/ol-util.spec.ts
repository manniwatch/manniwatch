/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { OlUtil } from '.';

describe('util/ol/ol-util', (): void => {
  describe('OlUtil', (): void => {
    describe('convertArcMSToCoordinate()', (): void => {
      it('should not throw on [0,0] coordinates', (): void => {
        expect(OlUtil.convertArcMSToCoordinate({
          lat: 0,
          lon: 0,
        })).toBeTruthy();
      });
    });
  });
});
