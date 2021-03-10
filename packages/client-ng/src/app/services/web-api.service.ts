/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpClient } from '@angular/common/http';
import {
    ISettings,
    IStopInfo,
    IStopLocations,
    IStopPassage,
    IStopPointLocations,
    ITripPassages,
    IVehicleLocation,
    IVehicleLocationList,
    IVehiclePathInfo,
} from '@manniwatch/api-types';
import { IBounds, TripInfoWithId } from '@manniwatch/client-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments';
import { ApiService } from './api.service';

export class WebApiService implements ApiService {

    public constructor(public http: HttpClient) { }

    public baseUrl(): string {
        return environment.apiEndpoint.endsWith('\/') ? environment.apiEndpoint : (`${environment.apiEndpoint}\/`);
    }

    public getTripPassages(tripId: string): Observable<TripInfoWithId> {
        return this.http.get<ITripPassages>(`${this.baseUrl()}trip/${tripId}/passages?mode=departure`)
            .pipe(map((trip: ITripPassages): TripInfoWithId =>
                Object.assign({
                    tripId,
                }, trip)));
    }
    public getRouteByVehicleId(vehicleId: string): Observable<IVehiclePathInfo> {
        return this.http.get<IVehiclePathInfo>(`${this.baseUrl()}vehicle/${vehicleId}/route`);
    }
    public getRouteByTripId(tripId: string): Observable<IVehiclePathInfo> {
        return this.http.get<IVehiclePathInfo>(`${this.baseUrl()}trip/${tripId}/route`);
    }
    public getStopInfo(stopId: string): Observable<IStopInfo> {
        return this.http.get<IStopInfo>(`${this.baseUrl()}stop/${stopId}/info`);
    }
    public getStopPassages(stopId: string): Observable<IStopPassage> {
        return this.http.get<IStopPassage>(`${this.baseUrl()}stop/${stopId}/passages`);
    }
    public getStopPointPassages(stopPointId: string): Observable<IStopPassage> {
        return this.http.get<IStopPassage>(`${this.baseUrl()}stopPoint/${stopPointId}/passages`);
    }
    public getVehicleLocations(lastUpdate: number = 0): Observable<IVehicleLocationList> {
        return this.http.get<IVehicleLocationList>(`${this.baseUrl()}geo/vehicles`, {
            params: {
                lastUpdate: `${lastUpdate}`,
            },
        });
    }
    public getVehicleLocation(vehicleId: string, lastUpdate: number = 0): Observable<IVehicleLocation> {
        return this.http.get<IVehicleLocation>(`${this.baseUrl()}geo/vehicle/${vehicleId}`, {
            params: {
                lastUpdate: `${lastUpdate}`,
            },
        });
    }

    public getStopLocations(bounds?: IBounds): Observable<IStopLocations> {
        if (bounds) {
            return this.http.get<IStopLocations>(`${this.baseUrl()}geo/stops`, {
                params: {
                    bottom: `${Math.round(bounds[0] * 3600000)}`,
                    left: `${Math.round(bounds[1] * 3600000)}`,
                    right: `${Math.round(bounds[2] * 3600000)}`,
                    top: `${Math.round(bounds[3] * 3600000)}`,
                },
            });
        }
        return this.http.get<IStopLocations>(`${this.baseUrl()}` +
            `geo/stops?left=-648000000&bottom=-324000000&right=648000000&top=324000000`);
    }
    public getStopPointLocations(bounds?: IBounds): Observable<IStopPointLocations> {
        if (bounds) {
            return this.http.get<IStopPointLocations>(`${this.baseUrl()}geo/stopPoints`, {
                params: {
                    bottom: `${Math.round(bounds[0] * 3600000)}`,
                    left: `${Math.round(bounds[1] * 3600000)}`,
                    right: `${Math.round(bounds[2] * 3600000)}`,
                    top: `${Math.round(bounds[3] * 3600000)}`,
                },
            });
        }
        return this.http.get<IStopPointLocations>(`${this.baseUrl()}` +
            `geo/stopPoints?left=-648000000&bottom=-324000000&right=648000000&top=324000000`);
    }

    public getSettings(): Observable<ISettings> {
        return this.http.get(`${this.baseUrl()}settings`, {
            responseType: 'text',
        })
            .pipe(map((body: string): ISettings => {
                const firstBracket: number = body.indexOf('{');
                const lastBracket: number = body.lastIndexOf('}');
                const parsedBody: string = body.substr(firstBracket, lastBracket - firstBracket + 1);
                return JSON.parse(parsedBody);
            }));
    }
}
