/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import * as turbo from '@donmahallem/turbo';
import { IVehicleLocationList, PositionType } from '@manniwatch/api-types';
import Bottleneck from 'bottleneck';
import express from 'express';
import { IConfig } from '../../../config';

interface IQueryParams {
    lastUpdate?: number;
    positionType?: PositionType;
}
type RHandler = express.RequestHandler<any, IVehicleLocationList, undefined, IQueryParams>;
export const createGetRequestHandler: (cfg: IConfig) => RHandler =
    (cfg: IConfig): RHandler => {
        const limiter: Bottleneck = new Bottleneck({
            maxConcurrent: 1,
            minTime: 1000,
        });
        const KEY_PREFIX: string = 'geo/vehicles';
        return (req: express.Request<undefined, IVehicleLocationList, undefined, IQueryParams>,
            res: express.Response<IVehicleLocationList>,
            next: express.NextFunction): void => {
            // tslint:disable-next-line:triple-equals
            const positionType: PositionType = (req.query.positionType as PositionType) || 'RAW';
            const lastUpdate: number | undefined = req.query.lastUpdate || undefined;
            const prom: Promise<IVehicleLocationList> = limiter.schedule({
                id: 'geo/vehicles',
            }, async (): Promise<IVehicleLocationList> => {
                const cacheKey: string = `${KEY_PREFIX}/${positionType}_${lastUpdate}`;
                const cachedItem: IVehicleLocationList | undefined = cfg.cache.get(cacheKey);
                // tslint:disable-next-line:triple-equals
                if (cachedItem != undefined) {
                    return cachedItem;
                }
                const responseData: IVehicleLocationList = await cfg.api.getVehicleLocations(positionType, lastUpdate);
                cfg.cache.set(cacheKey, responseData);
                return responseData;
            });
            turbo.promiseToResponse(prom, res, next);
        };
    };
