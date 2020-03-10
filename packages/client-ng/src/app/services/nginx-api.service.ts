import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    StopId,
    StopPointId,
    TripId,
    VehicleId,
} from '@donmahallem/trapeze-api-types';
import { Extent } from 'ol/extent';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments';
import { ApiService, TripInfoWithId } from './api.service';

@Injectable()
export class NginxApiService implements ApiService {

    public constructor(public http: HttpClient) { }

    public baseUrl(): string {
        return environment.apiEndpoint.endsWith('\/') ? environment.apiEndpoint : (environment.apiEndpoint + '\/');
    }

    public getTripPassages(tripId: TripId): Observable<TripInfoWithId> {
        return this.http.get<ITripPassages>(this.baseUrl() + 'trip/' + tripId + '/passages?mode=departure')
            .pipe(map((trip: ITripPassages): TripInfoWithId =>
                Object.assign({
                    tripId,
                }, trip)));
    }
    public getRouteByVehicleId(vehicleId: VehicleId): Observable<IVehiclePathInfo> {
        return this.http.get<IVehiclePathInfo>(this.baseUrl() + 'vehicle/' + vehicleId + '/route');
    }
    public getRouteByTripId(tripId: TripId): Observable<IVehiclePathInfo> {
        return this.http.get<IVehiclePathInfo>(this.baseUrl() + 'trip/' + tripId + '/route');
    }
    public getStopInfo(stopId: StopId): Observable<IStopInfo> {
        return this.http.get<IStopInfo>(this.baseUrl() + 'stop/' + stopId + '/info');
    }
    public getStopPassages(stopId: StopId): Observable<IStopPassage> {
        return this.http.get<IStopPassage>(this.baseUrl() + 'stop/' + stopId + '/passages');
    }
    public getStopPointPassages(stopPointId: StopPointId): Observable<IStopPassage> {
        return this.http.get<IStopPassage>(this.baseUrl() + 'stopPoint/' + stopPointId + '/passages');
    }
    public getVehicleLocations(lastUpdate: number = 0): Observable<IVehicleLocationList> {
        return this.http.get<IVehicleLocationList>(this.baseUrl() + 'geo/vehicles', {
            params: {
                lastUpdate: '' + lastUpdate,
            },
        });
    }
    public getVehicleLocation(vehicleId: VehicleId, lastUpdate: number = 0): Observable<IVehicleLocation> {
        return this.http.get<IVehicleLocation>(this.baseUrl() + 'geo/vehicle/' + vehicleId, {
            params: {
                lastUpdate: '' + lastUpdate,
            },
        });
    }

    public getStopLocations(bounds?: Extent): Observable<IStopLocations> {
        if (bounds) {
            return this.http.get<IStopLocations>(this.baseUrl() + 'geo/stops', {
                params: {
                    bottom: '' + Math.round(bounds[0] * 3600000),
                    left: '' + Math.round(bounds[0] * 3600000),
                    right: '' + Math.round(bounds[0] * 3600000),
                    top: '' + Math.round(bounds[0] * 3600000),
                },
            });
        }
        return this.http.get<IStopLocations>(this.baseUrl() +
            'geo/stops?left=-648000000&bottom=-324000000&right=648000000&top=324000000');
    }
    public getStopPointLocations(bounds?: Extent): Observable<IStopPointLocations> {
        if (bounds) {
            return this.http.get<IStopPointLocations>(this.baseUrl() + 'geo/stopPoints', {
                params: {
                    bottom: '' + Math.round(bounds[0] * 3600000),
                    left: '' + Math.round(bounds[0] * 3600000),
                    right: '' + Math.round(bounds[0] * 3600000),
                    top: '' + Math.round(bounds[0] * 3600000),
                },
            });
        }
        return this.http.get<IStopPointLocations>(this.baseUrl() +
            'geo/stopPoints?left=-648000000&bottom=-324000000&right=648000000&top=324000000');
    }

    public getSettings(): Observable<ISettings> {
        return this.http.get(this.baseUrl() + 'settings', {
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
