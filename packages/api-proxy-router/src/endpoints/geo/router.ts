/**
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { validateRequest } from '@donmahallem/turbo-validate-request';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { type PositionType } from '@manniwatch/api-types';
import { GEO_FENCE_SCHEMA, GET_VEHICLE_LOCATION_SCHEMA } from '@manniwatch/schemas';
import { default as express } from 'express';

/**
 * @param {ManniWatchApiClient} apiClient api client
 * @returns {express.Router} a express router instance
 */
export const createGeoRouter: (apiClient: ManniWatchApiClient) => express.Router = (apiClient: ManniWatchApiClient): express.Router => {
    const router: express.Router = express.Router();
    /**
     * @api {get} /geo/stops Request stop locations
     * @apiName StopLocations
     * @apiGroup Geo
     * @apiQuery {number} bottom Bottom Geo Border
     * @apiQuery {number} left Left Geo Border
     * @apiQuery {number} right Right Geo Border
     * @apiQuery {number} top Top Geo Border
     * @apiVersion 0.1.0
     */
    router.get('/stops', validateRequest('query', GEO_FENCE_SCHEMA), async (req: express.Request, res: express.Response): Promise<void> => {
        res.json(
            await apiClient.getStopLocations({
                bottom: parseInt(req.query.bottom as string, 10),
                left: parseInt(req.query.left as string, 10),
                right: parseInt(req.query.right as string, 10),
                top: parseInt(req.query.top as string, 10),
            })
        );
    });
    /**
     * @api {get} /geo/stopPoints Request stop locations
     * @apiName StopPointLocations
     * @apiGroup Geo
     * @apiQuery {number} bottom Bottom Geo Border
     * @apiQuery {number} left Left Geo Border
     * @apiQuery {number} right Right Geo Border
     * @apiQuery {number} top Top Geo Border
     * @apiVersion 0.4.0
     */
    router.get(
        '/stopPoints',
        validateRequest('query', GEO_FENCE_SCHEMA),
        async (req: express.Request, res: express.Response): Promise<void> => {
            res.json(
                await apiClient.getStopPointLocations({
                    bottom: parseInt(req.query.bottom as string, 10),
                    left: parseInt(req.query.left as string, 10),
                    right: parseInt(req.query.right as string, 10),
                    top: parseInt(req.query.top as string, 10),
                })
            );
        }
    );
    /**
     * @api {get} /geo/vehicles Request vehicle locations
     * @apiName GetVehicleLocations
     * @apiGroup Geo
     * @apiQuery {string="RAW","CORRECTED"} [mode="RAW"] Departure Mode to Query
     * @apiQuery {number} [lastUpdate=0] Get updates since this point in time
     * @apiVersion 0.1.0
     */
    router.get(
        '/vehicles',
        validateRequest('query', GET_VEHICLE_LOCATION_SCHEMA),
        async (req: express.Request, res: express.Response): Promise<void> => {
            // tslint:disable-next-line:triple-equals
            const positionType: PositionType = (req.query.positionType as PositionType) || 'RAW';
            const lastUpdate: number | undefined = req.query.lastUpdate ? parseInt(req.query.lastUpdate as string, 10) : undefined;
            res.json(await apiClient.getVehicleLocations(positionType, lastUpdate));
        }
    );
    return router;
};
