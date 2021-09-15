/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { InjectionToken } from '@angular/core';
import { IStorage } from './storage';

/**
 * Provides storage options
 */
export const LOCAL_STORAGE_TOKEN: InjectionToken<IStorage>
    = new InjectionToken<IStorage>('localStorageToken');
