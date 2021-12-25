/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { Observable } from 'rxjs';
import { SettingsService } from '.';

export const SETTINGS_SERVICE_FACTORY = (config: SettingsService): () => Observable<void> => {
    return (): Observable<void> => config.load();
};
