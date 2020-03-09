import { IWayPoint } from '@donmahallem/trapeze-api-types';
import { LatLng } from 'leaflet';
import { LeafletUtil } from './leaflet-util';
describe('src/app/leaflet/leaflet-util', () => {
    describe('LeafletUtil', () => {
        const testCoordinates: IWayPoint[] = new Array(10)
            .map((value: any, index: number): IWayPoint =>
                ({
                    lat: index * 100,
                    lon: 10000 - (index * 100),
                    seq: '' + index,
                }));
        const testConvertedCoordinates: L.LatLng[] = testCoordinates
            .map((value: IWayPoint) =>
                LeafletUtil.convertWayPointToLatLng(value));
        describe('convertWayPointToLatLng', () => {
            testCoordinates.forEach((value: IWayPoint) => {
                it('should convert the coordinates (' + value.lat + ',' + value.lon + ') correctly', () => {
                    const converted: LatLng = LeafletUtil.convertWayPointToLatLng(value);
                    expect(converted.lat).toEqual(value.lat / 3600000);
                    expect(converted.lng).toEqual(value.lon / 3600000);
                });
            });
        });
        describe('convertWayPointsToLatLng', () => {
            it('should convert the coordinate list correctly', () => {
                const converted: LatLng[] = LeafletUtil.convertWayPointsToLatLng(testCoordinates);
                expect(converted.length).toEqual(testCoordinates.length);
                expect(converted).toEqual(testConvertedCoordinates);
            });
        });
    });
});
