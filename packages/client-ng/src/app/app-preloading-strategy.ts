/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';

/**
 * Preloading Stategy for this app
 */
@Injectable()
export class AppPreloadingStrategy implements PreloadingStrategy {
    /**
     * Function to preload
     * @param route route to preload
     * @param load callback
     * @returns to preload
     */
    preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
        return route.path.startsWith('error') ? load() : EMPTY;
    }
}
