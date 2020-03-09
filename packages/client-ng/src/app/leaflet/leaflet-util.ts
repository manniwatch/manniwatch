import { IWayPoint } from '@donmahallem/trapeze-api-types';
import { LatLng } from 'leaflet';

export class LeafletUtil {

    /**
     * Converts the waypoint to lat lng coordinate object
     * @param wayPoint WayPoint to convert
     */
    public static convertWayPointToLatLng(wayPoint: IWayPoint): LatLng {
        return new LatLng(wayPoint.lat / 3600000, wayPoint.lon / 3600000);
    }
    /**
     * Converts a list of WayPoints
     * @param wayPoints WayPoints to convert
     */
    public static convertWayPointsToLatLng(wayPoints: IWayPoint[]): LatLng[] {
        return wayPoints
            .map((value: IWayPoint) => LeafletUtil.convertWayPointToLatLng(value));
    }
}
