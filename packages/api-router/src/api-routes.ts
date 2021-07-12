/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
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
    return route;
};
