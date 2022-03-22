/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Observable } from 'rxjs';
import { SettingsService } from '.';

export const SETTINGS_SERVICE_FACTORY = (config: SettingsService): (() => Observable<void>) => {
    return (): Observable<void> => config.load();
};
