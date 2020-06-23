/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { NgZone } from '@angular/core';
import { IStopLocation, IStopPointLocation } from '@manniwatch/api-types';
import { Map as OlMap, MapEvent, Map } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { combineLatest, Observable, Subscription, fromEvent } from 'rxjs';
import { startWith, take, map, shareReplay, first, flatMap } from 'rxjs/operators';
import { OlUtil } from 'src/app/util/ol';
import { OlMainMapDirective } from './ol-main-map.directive';
import BaseEvent from 'ol/events/Event';
import { toLonLat } from 'ol/proj';
import { getBottomLeft, getTopRight, Extent } from 'ol/extent';
import { runOutsideZone } from 'src/app/util/rxjs';
export class OlMarkerHandler {

    /**
     * Layer for the stop markers to be displayed on the map
     */
    private stopMarkerLayer: VectorLayer = undefined;
    /**
     * Layer for the stop markers to be displayed on the map
     */
    private stopPointMarkerLayer: VectorLayer = undefined;
    private stopPointMarkerVectorSource: VectorSource = undefined;
    private stopMarkerVectorSource: VectorSource = undefined;
    private loadSubscription: Subscription;
    public constructor(private mainMap: OlMainMapDirective,
        private readonly zoomBorder: number) {
    }

    public getStopLocations(): Observable<IStopLocation[]> {
        return this.mainMap.stopService.stopObservable
            .pipe(take(1), startWith([]));
    }

    public getStopPointLocations(): Observable<IStopPointLocation[]> {
        return this.mainMap.stopService.stopPointObservable
            .pipe(take(1), startWith([]));
    }

    public start(leafletMap: OlMap): void {
        NgZone.assertNotInAngularZone();
        this.stopPointMarkerVectorSource = new VectorSource();
        this.stopMarkerVectorSource = new VectorSource({
            features: [],
        });
        const adjustedZoomBorder: number = leafletMap.getView().getResolutionForZoom(this.zoomBorder);
        this.stopMarkerLayer = new VectorLayer({
            minResolution: adjustedZoomBorder,
            source: this.stopMarkerVectorSource,
        });
        this.stopPointMarkerLayer = new VectorLayer({
            maxResolution: adjustedZoomBorder,
            source: this.stopPointMarkerVectorSource,
        });
        leafletMap.addLayer(this.stopMarkerLayer);
        leafletMap.addLayer(this.stopPointMarkerLayer);
        const sharedZoomEvent: Observable<number> = fromEvent(leafletMap, 'moveend')
            .pipe(map((evt: MapEvent): number => {
                return evt.map.getView().getZoom();
            }), shareReplay(1));
        sharedZoomEvent.pipe(first((zoom: number): boolean => {
            return zoom < this.zoomBorder;
        }), flatMap((): Observable<IStopLocation[]> => {
            return this.getStopLocations();
        }), runOutsideZone(this.mainMap.zone)).subscribe((stops: IStopLocation[]): void => {
            console.log("stops", stops.length);
            this.setStops(stops);
        });
        sharedZoomEvent.pipe(first((zoom: number): boolean => {
            // Pull earlier to mitigate load delay and border step
            return zoom >= this.zoomBorder - 1;
        }), flatMap((): Observable<IStopPointLocation[]> => {
            return this.getStopPointLocations();
        }), runOutsideZone(this.mainMap.zone)).subscribe((stopPoints: IStopPointLocation[]): void => {
            console.log("stopPoints", stopPoints.length);
            this.setStopPoints(stopPoints);
        });
        /*const map: Map = evt.map;
        const extent: Extent = map.getView().calculateExtent(map.getSize());
        const [longitudeLeft, latitudeBottom] = toLonLat(getBottomLeft(extent));
        const [longitudeRight, latitudeTop] = toLonLat(getTopRight(extent));
        const longitude: any = {
            max: Math.ceil(longitudeRight * 3600000),
            min: Math.floor(longitudeLeft * 3600000),
        };
        const latitude: any = {
            max: Math.ceil(latitudeTop * 3600000),
            min: Math.floor(latitudeBottom * 3600000),
        };
        console.log(longitude, latitude);
        */

    }

    public setStopPoints(stopPoints: IStopPointLocation[]): void {
        NgZone.assertNotInAngularZone();
        if (this.stopPointMarkerVectorSource.getFeatures().length > 0) {
            this.stopPointMarkerVectorSource.clear(true);
        }
        const feats: Feature[] = stopPoints.map((value: IStopPointLocation): Feature => {
            const endMarker: Feature = new Feature({
                geometry: new Point(OlUtil.convertArcMSToCoordinate(value)),
                stopPoint: value,
                type: 'stopPoint',
            });
            endMarker.setStyle(OlUtil.createStyleByFeature(endMarker));
            return endMarker;
            // this.stopPointMarkerVectorSource.addFeature(endMarker);
        });
        this.stopPointMarkerVectorSource.addFeatures(feats);
        this.stopPointMarkerLayer.changed();
    }

    public setStops(stops: IStopLocation[]): void {
        NgZone.assertNotInAngularZone();
        if (this.stopMarkerVectorSource.getFeatures().length > 0) {
            this.stopMarkerVectorSource.clear(true);
        }
        const feats: Feature[] = stops.map((value: IStopLocation): Feature => {
            const endMarker: Feature = new Feature({
                geometry: new Point(OlUtil.convertArcMSToCoordinate(value)),
                stop: value,
                type: 'stop',
            });
            endMarker.setStyle(OlUtil.createStyleByFeature(endMarker));
            return endMarker;
        });
        this.stopMarkerVectorSource.addFeatures(feats);
        this.stopMarkerLayer.changed();
    }
    public stop(): void {
        if (this.loadSubscription) {
            this.loadSubscription.unsubscribe();
            this.loadSubscription = undefined;
        }
    }
}
