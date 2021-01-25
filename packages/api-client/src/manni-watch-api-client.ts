/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import {
    ISettings,
    IStopInfo,
    IStopLocations,
    IStopPassage,
    IStopPointInfo,
    IStopPointLocations,
    ITripPassages,
    IVehicleLocationList,
    IVehiclePathInfo,
    PositionType,
    StopMode,
} from '@manniwatch/api-types';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as qs from 'qs';
import { Util } from './util';

// tslint:disable-next-line:no-var-requires
export const DEFAULT_USER_AGENT: string = 'ManniWatch Api Client/__BUILD_VERSION__';
export interface IBoundingBox {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
export class ManniWatchApiClient {
    private httpClient: AxiosInstance;
    /**
     *
     * @param endpoint the endpoint base Url to query
     * @since 1.0.0
     */
    public constructor(public endpoint: string,
        public proxies?: string | string[],
        public randomUserAgent: boolean = false) {
        this.httpClient = axios.create({
            baseURL: endpoint,
            headers: {
                'User-Agent': DEFAULT_USER_AGENT,
            },
        });
    }

    public getProxy(): string | undefined {
        if (typeof this.proxies === 'string') {
            return this.proxies;
        } else if (Array.isArray(this.proxies)) {
            return this.proxies[Math.floor(Math.random() * this.proxies.length)];
        }
        return undefined;
    }

    public request<T>(reqOpts: AxiosRequestConfig): Promise<T> {
        const newReqOpts: any = {
            headers: {},
            proxy: this.getProxy(),
        };
        Object.assign(newReqOpts, reqOpts);
        return this.httpClient.request(reqOpts)
            .then((data: AxiosResponse<T>): T => {
                return data.data;
            });
    }

    /**
     * @since 1.0.0
     */
    /**
     * Correct
     * @param positionType coordinate type
     * @param lastUpdate timestamp of last update
     */
    public getVehicleLocations(positionType: PositionType = 'CORRECTED',
        lastUpdate?: string | number)
        : Promise<IVehicleLocationList> {
        const options: AxiosRequestConfig = {
            method: 'GET',
            params: {
                colorType: 'ROUTE_BASED',
                lastUpdate,
                positionType,
            },
            url: '/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles',
        };
        return this.request(options);
    }
    /**
     *
     * @param tripId tripId to query
     * @since 1.0.0
     */
    public getRouteByTripId(tripId: string): Promise<IVehiclePathInfo> {
        const options: AxiosRequestConfig = {
            method: 'POST',
            params: {
                id: tripId,
            },
            url: '/internetservice/geoserviceDispatcher/services/pathinfo/trip',
        };
        return this.request(options);
    }
    /**
     *
     * @param vehicleId the vehicleId
     * @since 1.0.0
     */
    public getRouteByVehicleId(vehicleId: string): Promise<IVehiclePathInfo> {
        const options: AxiosRequestConfig = {
            method: 'POST',
            params: {
                id: vehicleId,
            },
            url: '/internetservice/geoserviceDispatcher/services/pathinfo/vehicle',
        };
        return this.request(options);
    }

    /**
     *
     * @param routeId the route id
     * @since 3.0.0
     */
    public getRouteByRouteId(routeId: string, direction: string): Promise<IVehiclePathInfo> {
        const options: AxiosRequestConfig = {
            method: 'POST',
            params: {
                direction,
                id: routeId,
            },
            url: '/internetservice/geoserviceDispatcher/services/pathinfo/route',
        };
        return this.request(options);
    }

    /**
     *
     * @since 1.4.0
     */
    public getStopLocations(box: IBoundingBox = {
        bottom: -324000000,
        left: -648000000,
        right: 648000000,
        top: 324000000,
    }): Promise<IStopLocations> {
        const options: AxiosRequestConfig = {
            method: 'GET',
            params: box,
            url: '/internetservice/geoserviceDispatcher/services/stopinfo/stops',
        };
        return this.request(options);
    }

    /**
     *
     * @since 1.4.0
     */
    public getStopPointLocations(box: IBoundingBox = {
        bottom: -324000000,
        left: -648000000,
        right: 648000000,
        top: 324000000,
    }): Promise<IStopPointLocations> {
        const options: AxiosRequestConfig = {
            method: 'GET',
            params: box,
            url: '/internetservice/geoserviceDispatcher/services/stopinfo/stopPoints',
        };
        return this.request(options);
    }
    /**
     *
     * @since 1.0.0
     */
    public getTripPassages(tripId: string,
        mode: StopMode = 'departure'): Promise<ITripPassages> {
        const options: AxiosRequestConfig = {
            data: qs.stringify({
                mode,
                tripId,
            }),
            method: 'POST',
            url: '/internetservice/services/tripInfo/tripPassages',
        };
        return this.request(options);
    }

    /**
     *
     * @param startTime milliseconds since epoch. now if undefined
     * @param timeFrame time frame from startTime in minutes
     * @since 2.3.0
     */
    public getStopPassages(stopId: string,
        mode: StopMode = 'departure',
        startTime?: number,
        timeFrame?: number): Promise<IStopPassage> {
        const options: AxiosRequestConfig = {
            data: qs.stringify({
                mode,
                startTime: startTime || undefined,
                stop: stopId,
                timeFrame: timeFrame || undefined,
            }),
            method: 'POST',
            url: '/internetservice/services/passageInfo/stopPassages/stop',
        };
        return this.request(options);
    }

    /**
     *
     * @param startTime milliseconds since epoch. now if undefined
     * @param timeFrame time frame from startTime in minutes
     * @since 3.0.0
     */
    public getStopPointPassages(stopPointId: string,
        mode: StopMode = 'departure',
        startTime?: number,
        timeFrame?: number): Promise<IStopPassage> {
        const options: AxiosRequestConfig = {
            data: qs.stringify({
                mode,
                startTime: startTime || undefined,
                stopPoint: stopPointId,
                timeFrame: timeFrame || undefined,
            }),
            method: 'POST',
            url: '/internetservice/services/passageInfo/stopPassages/stopPoint',
        };
        return this.request(options);
    }

    /**
     *
     * @since 1.0.0
     */
    public getStopInfo(stopId: string): Promise<IStopInfo> {
        const options: AxiosRequestConfig = {
            data: qs.stringify({ stop: stopId }),
            method: 'POST',
            url: '/internetservice/services/stopInfo/stop',
        };
        return this.request(options);
    }

    /**
     *
     * @since 1.0.0
     */
    public getStopPointInfo(stopPointId: string): Promise<IStopPointInfo> {
        const options: AxiosRequestConfig = {
            data: qs.stringify({ stopPoint: stopPointId }),
            method: 'POST',
            url: '/internetservice/services/stopInfo/stopPoint',
        };
        return this.request(options);
    }
    /**
     * @since 1.3.0
     */
    public getSettings(): Promise<ISettings> {
        const options: AxiosRequestConfig = {
            headers: {
                Accept: 'text/javascript',
            },
            method: 'GET',
            transformResponse: Util.transformSettingsBody,
            url: '/internetservice/settings',
        };
        return this.request(options);
    }

}
