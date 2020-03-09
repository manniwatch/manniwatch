import { IVehiclePath } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { RouteDisplayHandler } from './route-display-handler';

const testVehiclePath: IVehiclePath[] = [
    {
        color: '#FFFFFF',
        wayPoints: [{
            lat: 1,
            lon: 2,
            seq: '1',
        }, {
            lat: 3,
            lon: 4,
            seq: '2',
        }],
    },
];
describe('src/app/leaflet/route-display-handler', () => {
    describe('RouteDisplayHandler', () => {
        const mapSpy: jasmine.SpyObj<L.Map> = jasmine.createSpyObj(L.Map, ['addLayer']);
        const routeLayerSpyObj: jasmine.SpyObj<L.FeatureGroup> = jasmine.createSpyObj(L.FeatureGroup, ['clearLayers', 'addLayer']);
        let testInstance: RouteDisplayHandler;
        beforeEach(() => {
            testInstance = new RouteDisplayHandler(mapSpy);
            (testInstance as any).routeLayer = routeLayerSpyObj;
        });
        afterEach(() => {
            const subscription: Subscription = (testInstance as any).subscription;
            if (subscription) {
                subscription.unsubscribe();
            }
            routeLayerSpyObj.clearLayers.calls.reset();
            mapSpy.addLayer.calls.reset();
            routeLayerSpyObj.addLayer.calls.reset();
        });
        describe('constructor()', () => {
            it('should add the route layer', () => {
                // for some reason this fluctuates in calls
                // TODO: investigate and fix
                expect(mapSpy.addLayer.calls.count()).toEqual(1);
            });
        });
        describe('setRoutePaths()', () => {
            afterEach(() => {
                expect(routeLayerSpyObj.clearLayers.calls.count()).toEqual(1);
            });
            it('should not call addLayer if no paths are defined', () => {
                (testInstance as any).setRoutePaths(undefined);
                expect(routeLayerSpyObj.addLayer.calls.count()).toEqual(0);
            });
            it('should not call addLayer if an empty path list is provided', () => {
                (testInstance as any).setRoutePaths([]);
                expect(routeLayerSpyObj.addLayer.calls.count()).toEqual(0);
            });
            it('should call addLayer as often as paths are provided (1)', () => {
                (testInstance as any).setRoutePaths(testVehiclePath);
                expect(routeLayerSpyObj.addLayer.calls.count()).toEqual(1);
                expect(routeLayerSpyObj.clearLayers).toHaveBeenCalledBefore(routeLayerSpyObj.addLayer);
            });
            it('should call addLayer as often as paths are provided (2)', () => {
                (testInstance as any).setRoutePaths(testVehiclePath.concat(testVehiclePath));
                expect(routeLayerSpyObj.addLayer.calls.count()).toEqual(2);
                expect(routeLayerSpyObj.clearLayers).toHaveBeenCalledBefore(routeLayerSpyObj.addLayer);
            });

        });
    });
});
