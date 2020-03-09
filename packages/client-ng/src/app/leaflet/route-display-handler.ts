import { IVehiclePath } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { LeafletUtil } from './leaflet-util';
/**
 * Handles polling and displaying of route data on the map
 */
export class RouteDisplayHandler {
    /**
     * Layer for the route data
     */
    private routeLayer: L.FeatureGroup = undefined;
    /**
     *
     * @param map The map to display the route on
     * @param api the api service to be used
     */
    constructor(private map: L.Map) {
        this.routeLayer = L.featureGroup();
        this.routeLayer.addTo(this.map);
    }
    /**
     * Adds the vehicle path to the map
     * @param paths Path to add
     */
    public setRoutePaths(paths: IVehiclePath[]): void {
        this.routeLayer.clearLayers();
        if (paths) {
            for (const path of paths) {
                const pointList: L.LatLng[] = LeafletUtil.convertWayPointsToLatLng(path.wayPoints);
                const firstpolyline = L.polyline(pointList, {
                    color: path.color,
                    opacity: 0.5,
                    smoothFactor: 1,
                    weight: 3,
                });
                firstpolyline.addTo(this.routeLayer);
            }
        }
    }

    /**
     * Clears displayed routes
     */
    public clear(): void {
        this.routeLayer.clearLayers();
    }
}
