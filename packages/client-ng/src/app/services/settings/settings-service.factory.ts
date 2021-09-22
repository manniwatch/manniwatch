/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Observable } from 'rxjs';
import { SettingsService } from '.';

export const SETTINGS_SERVICE_FACTORY = (config: SettingsService): () => Observable<void> => {
    return (): Observable<void> => config.load();
};
