/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-vehicle-sse
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import * as express from 'express';
import * as endpoints from './endpoints';

/**
 *
 * @param endpoint example: http://test.domain/
 */
export const createApiProxyRouter: (endpoint: string | ManniWatchApiClient) => express.Router = (endpoint: string): express.Router => {
    const apiClient: ManniWatchApiClient = (typeof endpoint === 'string') ?
        new ManniWatchApiClient(endpoint) :
        endpoint;
    const route: express.Router = express.Router();

    route.use('/geo', endpoints.createGeoRouter(apiClient));
    route.use('/trip', endpoints.createTripRouter(apiClient));
    route.use('/vehicle', endpoints.createVehicleRouter(apiClient));
    route.use('/stop', endpoints.createStopRouter(apiClient));
    route.use('/stopPoint', endpoints.createStopPointRouter(apiClient));
    route.use('/settings', endpoints.createSettingsRouter(apiClient));
    return route;
};
