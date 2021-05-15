/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import * as prom from '@donmahallem/turbo';
import { ManniWatchApiClient } from '@manniwatch/api-client';
import { ISettings } from '@manniwatch/api-types';
import { Mutex } from 'async-mutex';
import { createHash } from 'crypto';
import express from 'express';
import NodeCache from 'node-cache';

interface ISettingsEntry {
    data: ISettings;
    etag: string;
    lastModified: Date;
}
const CACHE_KEY_SETTINGS: string = 'mw_settings';
export const createSettingsRouter: (apiClient: ManniWatchApiClient, cache: NodeCache) => express.Router =
    (apiClient: ManniWatchApiClient, cache: NodeCache): express.Router => {
        const router: express.Router = express.Router();
        const settingsMutex: Mutex = new Mutex();
        /**
         * @api {get} /settings Request Trapeze Settings
         * @apiName GetSettings
         * @apiGroup Settings
         *
         * @apiVersion 0.1.0
         */
        router.get('', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
            const getSettings: Promise<ISettings> = settingsMutex.runExclusive(async (): Promise<ISettingsEntry> => {
                const cacheContent: ISettingsEntry | undefined = cache.get(CACHE_KEY_SETTINGS);
                if (cacheContent) {
                    return cacheContent;
                }
                const retrievedSettings: ISettings = await apiClient.getSettings();
                const hashedData: string = createHash('md5')
                    .update(JSON.stringify(retrievedSettings), 'utf-8')
                    .digest('hex');
                const cacheEntry: ISettingsEntry = {
                    data: retrievedSettings,
                    etag: hashedData,
                    lastModified: new Date(),
                };
                cache.set(CACHE_KEY_SETTINGS, cacheEntry, 600);
                return cacheEntry;
            }).then((data: ISettingsEntry): ISettings => {
                res.setHeader('ETag', `W/\"${data.etag}\"`);
                res.setHeader('Last-Modified', data.lastModified.toUTCString());
                return data.data;
            });
            prom.promiseToResponse(getSettings, res, next);
        });
        return router;
    };
