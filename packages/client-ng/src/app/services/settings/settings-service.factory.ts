/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Observable } from 'rxjs';
import { SettingsService } from '.';

export function SettingsServiceFactory(config: SettingsService): () => Observable<void> {
    return () => config.load();
}
