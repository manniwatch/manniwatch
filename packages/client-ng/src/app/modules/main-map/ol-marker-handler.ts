/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { NgZone } from '@angular/core';
import { IStopLocation, IStopPointLocation } from '@manniwatch/api-types';
import { Map as OlMap } from 'ol';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { startWith, take } from 'rxjs/operators';
import { OlUtil } from 'src/app/util/ol';
import { OlMainMapDirective } from './ol-main-map.directive';
export class OlMarkerHandler {
    /**
     * Layer for the stop markers to be displayed on the map
     */
    private stopMarkerLayer: VectorLayer<VectorSource<Point>> = undefined;
    /**
     * Layer for the stop markers to be displayed on the map
     */
    private stopPointMarkerLayer: VectorLayer<VectorSource<Point>> = undefined;
    private stopPointMarkerVectorSource: VectorSource<Point> = undefined;
    private stopMarkerVectorSource: VectorSource<Point> = undefined;
    private loadSubscription: Subscription;
    public constructor(
        private mainMap: OlMainMapDirective,
        private readonly zoomBorder: number
    ) {}

    public getStopLocations(): Observable<IStopLocation[]> {
        return this.mainMap.stopService.stopObservable.pipe(take(1), startWith([]));
    }

    public getStopPointLocations(): Observable<IStopPointLocation[]> {
        return this.mainMap.stopService.stopPointObservable.pipe(take(1), startWith([]));
    }

    public start(leafletMap: OlMap): void {
        NgZone.assertNotInAngularZone();
        this.stopPointMarkerVectorSource = new VectorSource();
        this.stopMarkerVectorSource = new VectorSource({
            features: [],
        });
        const zoomBorder: number = leafletMap.getView().getResolutionForZoom(this.zoomBorder);
        this.stopMarkerLayer = new VectorLayer({
            minResolution: zoomBorder,
            source: this.stopMarkerVectorSource,
        });
        this.stopPointMarkerLayer = new VectorLayer({
            maxResolution: zoomBorder,
            source: this.stopPointMarkerVectorSource,
        });
        leafletMap.addLayer(this.stopMarkerLayer);
        leafletMap.addLayer(this.stopPointMarkerLayer);
        this.loadSubscription = combineLatest([this.getStopLocations(), this.getStopPointLocations()]).subscribe(
            (result: [IStopLocation[], IStopPointLocation[]]): void => {
                this.setStopPoints(result[1]);
                this.setStops(result[0]);
            }
        );
    }

    public setStopPoints(stopPoints: IStopPointLocation[]): void {
        NgZone.assertNotInAngularZone();
        if (this.stopPointMarkerVectorSource.getFeatures().length > 0) {
            this.stopPointMarkerVectorSource.clear(true);
        }
        const feats: Feature<Point>[] = stopPoints.map((value: IStopPointLocation): Feature<Point> => {
            const endMarker: Feature<Point> = new Feature<Point>({
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
        const feats: Feature<Point>[] = stops.map((value: IStopLocation): Feature<Point> => {
            const endMarker: Feature<Point> = new Feature<Point>({
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
