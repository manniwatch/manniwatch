/*
 * Package @manniwatch/api-proxy-router
 * Source https://manniwatch.github.io/docs/api-proxy-router/index.html
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import { ISettings } from '@manniwatch/api-types';
import { Mutex } from 'async-mutex';
import { createHash } from 'crypto';
import express from 'express';
import NodeCache from 'node-cache';

interface ISettingsEntry {
    data: string;
    etag: string;
    lastModified: Date;
}
const CACHE_KEY_SETTINGS = 'mw_settings';
/**
 * @param {ManniWatchApiClient} apiClient api client
 * @param {NodeCache} cache A cache instance
 * @returns {express.Router} a express router instance
 */
export const createSettingsRouter: (apiClient: ManniWatchApiClient, cache: NodeCache) => express.Router = (
    apiClient: ManniWatchApiClient,
    cache: NodeCache
): express.Router => {
    const router: express.Router = express.Router();
    const settingsMutex: Mutex = new Mutex();
    /**
     * @api {get} /settings Request Trapeze Settings
     * @apiName GetSettings
     * @apiGroup Settings
     * @apiVersion 0.1.0
     */
    router.get('', async (req: express.Request, res: express.Response): Promise<void> => {
        await settingsMutex
            .runExclusive(async (): Promise<ISettingsEntry> => {
                const cacheContent: ISettingsEntry | undefined = cache.get(CACHE_KEY_SETTINGS);
                if (cacheContent) {
                    return cacheContent;
                }
                const retrievedSettings: ISettings = await apiClient.getSettings();
                const serializedData: string = JSON.stringify(retrievedSettings);
                const hashedData: string = createHash('md5').update(serializedData, 'utf-8').digest('hex');
                const cacheEntry: ISettingsEntry = {
                    data: serializedData,
                    etag: hashedData,
                    lastModified: new Date(),
                };
                cache.set(CACHE_KEY_SETTINGS, cacheEntry, 600);
                return cacheEntry;
            })
            .then((data: ISettingsEntry): void => {
                res.set('ETag', `W/"${data.etag}"`)
                    .set('Last-Modified', data.lastModified.toUTCString())
                    .contentType('application/json; charset=utf-8')
                    .send(data.data);
            });
    });
    return router;
};
