/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IStopLocation } from '@manniwatch/api-types';
import { Observable } from 'rxjs';
import { createSearchKeys, StopPointService } from 'src/app/services';

@Injectable()
export class SearchResultResolver implements Resolve<any> {

    public constructor(private stopService: StopPointService) { }
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopLocation[]> {
        const queryString: string = route.queryParams.q;
        const queryKeys: string[] = createSearchKeys(queryString);
        return this.stopService
            .searchStop(queryKeys);
    }
}
