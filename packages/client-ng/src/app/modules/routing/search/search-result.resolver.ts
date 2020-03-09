import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StopPointService } from 'src/app/services/stop-point.service';

@Injectable()
export class SearchResultResolver implements Resolve<any> {

    public constructor(private stopService: StopPointService) { }
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopLocation[]> {
        return this.stopService.stopLocationsObservable
            .pipe(take(1),
                map((stops: IStopLocation[]): IStopLocation[] =>
                    stops
                        /**
                         * Filter by search term
                         */
                        .filter((option) => option.name.toLowerCase().includes(route.queryParams.q))
                        .sort((a, b) => a.name.localeCompare(b.name))));
    }
}
