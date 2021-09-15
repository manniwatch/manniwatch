/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { fromEvent, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Theme } from '../theme';

export const createCssThemeWatcher: () => Observable<Theme> = (): Observable<Theme> => {
    const prefersDarkScheme: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    const obs: Observable<MediaQueryListEvent> = fromEvent<MediaQueryListEvent>(prefersDarkScheme, 'change');
    return obs
        .pipe(map((evt: MediaQueryListEvent): Theme => {
            return evt.matches ? Theme.DARK : Theme.LIGHT;
        }), startWith(prefersDarkScheme.matches ? Theme.DARK : Theme.LIGHT));
};
