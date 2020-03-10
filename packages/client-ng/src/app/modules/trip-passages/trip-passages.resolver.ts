import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TripId } from '@donmahallem/trapeze-api-types';
import { Observable } from 'rxjs';
import { ApiService } from '../../services';
import { IPassageStatus, TripPassagesUtil } from './trip-util';

/**
 * Resolver used to retrieve TripPassage Information in {@link TripPassagesRoutingModule}
 */
@Injectable()
export class TripPassagesResolver implements Resolve<IPassageStatus> {

    public constructor(private api: ApiService) { }
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPassageStatus> {
        const tripId: TripId = route.params.tripId as TripId;
        return this.api.getTripPassages(tripId)
            .pipe(TripPassagesUtil.convertResponse(tripId),
                TripPassagesUtil.handleError(tripId));
    }
}
