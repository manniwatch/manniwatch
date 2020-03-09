/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { PreloadingStrategy, Route } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';

export class AppPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.path.startsWith('error') ? load() : EMPTY;
  }
}
