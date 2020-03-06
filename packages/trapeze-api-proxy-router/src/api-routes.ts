/*!
 * Source https://github.com/donmahallem/trapeze Package: trapeze-api-proxy-router
 */

import { TrapezeApiClient } from '@donmahallem/trapeze-api-client';
import * as express from 'express';
import {
    GeoEndpoints,
    StopEndpoints,
    StopPointEndpoints,
    TripEndpoints,
    VehicleEndpoints,
} from './endpoints';
import { SettingsEndpoints } from './endpoints/settings';

/**
 *
 * @param endpoint example: http://test.domain/
 */
export const createTrapezeApiProxyRouter: (endpoint: string) => express.Router = (endpoint: string): express.Router => {
    const trapezeApi: TrapezeApiClient = new TrapezeApiClient(endpoint);
    const route: express.Router = express.Router();
    /**
     * @api {get} /geo/stations Request station locations
     * @apiName GetStationsLocations
     * @apiGroup Geo
     *
     * @apiVersion 1.0.0
     * @apiDeprecated use now (#Geo:StopLocations).
     */
    /**
     * @api {get} /geo/stops Request stop locations
     * @apiName StopLocations
     * @apiGroup Geo
     *
     * @apiVersion 1.5.0
     */
    route.get('/geo/stops', GeoEndpoints.createStationLocationsEndpoint(trapezeApi));
    /**
     * @api {get} /geo/vehicles Request vehicle locations
     * @apiName GetVehicleLocations
     * @apiGroup Geo
     *
     * @apiVersion 1.5.0
     */
    route.get('/geo/vehicles', GeoEndpoints.createVehicleLocationsEndpoint(trapezeApi));
    /**
     * @api {get} /trip/:id/route Request Vehicle Route
     * @apiName GetTripRoute
     * @apiGroup Trip
     *
     * @apiParam {String} id Vehicle id
     * @apiVersion 1.5.0
     */
    route.get('/trip/:id([a-z0-9A-Z\-\+]+)/route', TripEndpoints.createTripRouteEndpoint(trapezeApi));
    /**
     * @api {get} /vehicle/:id/route Request Vehicle Route
     * @apiName GetVehicleRoute
     * @apiGroup Vehicle
     *
     * @apiParam {String} id Vehicle id
     * @apiVersion 1.5.0
     */
    route.get('/vehicle/:id([a-z0-9A-Z\-\+]+)/route', VehicleEndpoints.createVehicleInfoEndpoint(trapezeApi));
    /**
     * @api {get} /stop/:id/departures Request Stop Departures
     * @apiName GetStopDepartures
     * @apiGroup Stop
     *
     * @apiParam {String} id Stop id
     * @apiVersion 1.5.0
     */
    route.get('/stop/:id([a-z0-9A-Z\-\+]+)/departures', StopEndpoints.createStopDeparturesEndpoint(trapezeApi));
    /**
     * @api {get} /stop/:id/info Request Stop Info
     * @apiName GetStopInfo
     * @apiGroup Stop
     *
     * @apiParam {String} id Stop id
     * @apiVersion 1.5.0
     */
    route.get('/stop/:id([a-z0-9A-Z\-\+]+)/info', StopEndpoints.createStopInfoEndpoint(trapezeApi));
    /**
     * @api {get} /stopPoint/:id/info Request stop point info
     * @apiName StopPointInfo
     * @apiGroup StopPoint
     *
     * @apiParam {String} id Stop Point ID
     * @apiVersion 1.5.0
     */
    route.get('/stopPoint/:id([a-z0-9A-Z\-\+]+)/info', StopPointEndpoints.createStopPointInfoEndpoint(trapezeApi));
    /**
     * @since 1.5.0
     */
    /**
     * @api {get} /settings Request Trapeze Settings
     * @apiName GetSettings
     * @apiGroup Settings
     * @apiVersion 1.5.0
     */
    route.get('/settings', SettingsEndpoints.createSettingsEndpoint(trapezeApi));
    return route;
};
