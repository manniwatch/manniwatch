/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { ManniWatchApiClient } from '@manniwatch/api-client';
import NodeCache from 'node-cache';

export interface IConfig {
    api: ManniWatchApiClient;
    cache: NodeCache;
}
