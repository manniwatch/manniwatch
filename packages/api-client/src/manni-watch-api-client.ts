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
import * as req from 'request';
import * as reqp from 'request-promise-native';
import { Util } from './util';

// tslint:disable-next-line:no-var-requires
export const DEFAULT_USER_AGENT: string = 'ManniWatch Api Client/___BUILD_VERSION___';
export interface IBoundingBox {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
export class ManniWatchApiClient {
    private httpClient: req.RequestAPI<reqp.RequestPromise<any>, reqp.RequestPromiseOptions, req.UriOptions>;
    /**
     *
     * @param endpoint the endpoint base Url to query
     * @since 1.0.0
     */
    public constructor(public endpoint: string,
        public proxies?: string | string[],
        public randomUserAgent: boolean = false) {
        this.httpClient = reqp.defaults({
            baseUrl: endpoint,
            headers: {
                'User-Agent': DEFAULT_USER_AGENT,
            },
            json: true,
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

    public request<T>(reqOpts: req.OptionsWithUri): reqp.RequestPromise<T> {
        const newReqOpts: any = {
            headers: {},
            proxy: this.getProxy(),
        };
        Object.assign(newReqOpts, reqOpts);
        return this.httpClient(newReqOpts);
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
        : reqp.RequestPromise<IVehicleLocationList> {
        const options: req.OptionsWithUri = {
            method: 'GET',
            qs: {
                colorType: 'ROUTE_BASED',
                lastUpdate,
                positionType,
            },
            uri: '/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles',
        };
        return this.request(options);
    }
    /**
     *
     * @param tripId tripId to query
     * @since 1.0.0
     */
    public getRouteByTripId(tripId: string): reqp.RequestPromise<IVehiclePathInfo> {
        const options: req.OptionsWithUri = {
            method: 'POST',
            qs: {
                id: tripId,
            },
            uri: '/internetservice/geoserviceDispatcher/services/pathinfo/trip',
        };
        return this.request(options);
    }
    /**
     *
     * @param vehicleId the vehicleId
     * @since 1.0.0
     */
    public getRouteByVehicleId(vehicleId: string): reqp.RequestPromise<IVehiclePathInfo> {
        const options: req.OptionsWithUri = {
            method: 'POST',
            qs: {
                id: vehicleId,
            },
            uri: '/internetservice/geoserviceDispatcher/services/pathinfo/vehicle',
        };
        return this.request(options);
    }

    /**
     *
     * @param routeId the route id
     * @since 3.0.0
     */
    public getRouteByRouteId(routeId: string, direction: string): reqp.RequestPromise<IVehiclePathInfo> {
        const options: req.OptionsWithUri = {
            method: 'POST',
            qs: {
                direction,
                id: routeId,
            },
            uri: '/internetservice/geoserviceDispatcher/services/pathinfo/route',
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
    }): reqp.RequestPromise<IStopLocations> {
        const options: req.OptionsWithUri = {
            method: 'GET',
            qs: box,
            uri: '/internetservice/geoserviceDispatcher/services/stopinfo/stops',
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
    }): reqp.RequestPromise<IStopPointLocations> {
        const options: req.OptionsWithUri = {
            method: 'GET',
            qs: box,
            uri: '/internetservice/geoserviceDispatcher/services/stopinfo/stopPoints',
        };
        return this.request(options);
    }
    /**
     *
     * @since 1.0.0
     */
    public getTripPassages(tripId: string,
        mode: StopMode = 'departure'): reqp.RequestPromise<ITripPassages> {
        const options: req.OptionsWithUri = {
            form: {
                mode,
                tripId,
            },
            method: 'POST',
            uri: '/internetservice/services/tripInfo/tripPassages',
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
        timeFrame?: number): reqp.RequestPromise<IStopPassage> {
        const formData: { [key: string]: any } = {
            mode,
            stop: stopId,
        };
        // tslint:disable-next-line:triple-equals
        if (startTime != undefined) {
            Object.assign(formData, { startTime });
        }
        // tslint:disable-next-line:triple-equals
        if (timeFrame != undefined) {
            Object.assign(formData, { timeFrame });
        }
        const options: req.OptionsWithUri = {
            form: formData,
            method: 'POST',
            uri: '/internetservice/services/passageInfo/stopPassages/stop',
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
        timeFrame?: number): reqp.RequestPromise<IStopPassage> {
        const formData: { [key: string]: any } = {
            mode,
            stopPoint: stopPointId,
        };
        // tslint:disable-next-line:triple-equals
        if (startTime != undefined) {
            Object.assign(formData, { startTime });
        }
        // tslint:disable-next-line:triple-equals
        if (timeFrame != undefined) {
            Object.assign(formData, { timeFrame });
        }
        const options: req.OptionsWithUri = {
            form: formData,
            method: 'POST',
            uri: '/internetservice/services/passageInfo/stopPassages/stopPoint',
        };
        return this.request(options);
    }

    /**
     *
     * @since 1.0.0
     */
    public getStopInfo(stopId: string): reqp.RequestPromise<IStopInfo> {
        const options: req.OptionsWithUri = {
            form: {
                stop: stopId,
            },
            method: 'POST',
            uri: '/internetservice/services/stopInfo/stop',
        };
        return this.request(options);
    }

    /**
     *
     * @since 1.0.0
     */
    public getStopPointInfo(stopPointId: string): reqp.RequestPromise<IStopPointInfo> {
        const options: req.OptionsWithUri = {
            form: {
                stopPoint: stopPointId,
            },
            method: 'POST',
            uri: '/internetservice/services/stopInfo/stopPoint',
        };
        return this.request(options);
    }
    /**
     * @since 1.3.0
     */
    public getSettings(): reqp.RequestPromise<ISettings> {
        const options: reqp.OptionsWithUri = {
            headers: {
                Accept: 'text/javascript',
            },
            method: 'GET',
            transform: Util.transformSettingsBody,
            uri: '/internetservice/settings',
        };
        return this.request(options);
    }

}
