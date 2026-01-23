/**
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import express from 'express';
import NodeCache from 'node-cache';
import * as endpoints from './endpoints/index.js';

/**
 * @param {string|ManniWatchApiClient} endpoint example: http://test.domain/
 * @returns {express.Router} a express router instance
 */
export const createApiProxyRouter: (endpoint: string | ManniWatchApiClient) => express.Router = (endpoint: string): express.Router => {
    const apiClient: ManniWatchApiClient = typeof endpoint === 'string' ? new ManniWatchApiClient(endpoint) : endpoint;
    const route: express.Router = express.Router();
    const apiCache: NodeCache = new NodeCache();

    route.use('/geo', endpoints.createGeoRouter(apiClient));
    route.use('/trip', endpoints.createTripRouter(apiClient));
    route.use('/vehicle', endpoints.createVehicleRouter(apiClient));
    route.use('/stop', endpoints.createStopRouter(apiClient));
    route.use('/stopPoint', endpoints.createStopPointRouter(apiClient));
    route.use('/settings', endpoints.createSettingsRouter(apiClient, apiCache));
    return route;
};
