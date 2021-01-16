/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { IVehicleLocation } from '@manniwatch/api-types';
import { Coordinate } from 'ol/coordinate';
import { fromLonLat } from 'ol/proj';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style, { StyleFunction, StyleLike } from 'ol/style/Style';
import Text from 'ol/style/Text';
import { FeatureLike } from 'ol/Feature';
import { TrapezeCoord } from './trapeze-coord';

const DEFAULT_STYLES: { [key: string]: StyleLike; } = {
    icon: new Style({
        image: new Icon({
            anchor: [0.5, 0.5],
            // size: [32, 32],
            imgSize: [64, 44],
            scale: 0.5,
            src: 'assets/vehicle-icon-24.svg',
        }),
    }),
    route: new Style({
        stroke: new Stroke({
            color: [237, 212, 0, 0.8], width: 6,
        }),
    }),
    stop: new Style({
        image: new CircleStyle({
            fill: new Fill({ color: '#111111' }),
            radius: 12,
            stroke: new Stroke({
                color: '#EEEEEE', width: 2,
            }),
        }),
        text: new Text({
            fill: new Fill({ color: '#EEEEEE' }),
            font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
            text: 'H',
            // stroke: new Stroke({ color: '#FFfF00', width: 5 }),
        }),
        zIndex: 990,
    }),
    stop_selected: new Style({
        image: new CircleStyle({
            fill: new Fill({ color: '#AAAAFF' }),
            radius: 12,
            stroke: new Stroke({
                color: '#111111', width: 2,
            }),
        }),
        text: new Text({
            fill: new Fill({ color: '#111111' }),
            font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
            text: 'H',
            // stroke: new Stroke({ color: '#FFfF00', width: 5 }),
        }),
        zIndex: 1000,
    }),
    vehicle: (p0: FeatureLike, p1: number): Style => {
        const vehicle: IVehicleLocation = p0.get('vehicle');
        // eslint-disable-next-line eqeqeq
        if (vehicle != undefined) {
            const rot: number = Math.PI / 180 * ((vehicle.heading + 270) % 360);
            return new Style({
                image: new Icon({
                    anchor: [24 / 68, 0.5],
                    color: '#FF0000',
                    imgSize: [64, 44],
                    rotation: rot,
                    scale: 0.6,
                    src: 'assets/vehicle-icon-white-64.svg',
                }),
                text: new Text({
                    fill: new Fill({ color: '#FFFFFF' }),
                    font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
                    // rotation: rot,
                    text: vehicle.name.split(' ')[0],
                }),
                zIndex: 995,
            });
        }
        return undefined;
    },
    vehicle_route: new Style({
        stroke: new Stroke({
            color: [255, 50, 50, 0.75],
            width: 5,
        }),
        zIndex: 600,
    }),
    vehicle_selected: (p0: FeatureLike, p1: number): Style => {
        const vehicle: IVehicleLocation = p0.get('vehicle');
        // eslint-disable-next-line eqeqeq
        if (vehicle != undefined) {
            const rot: number = Math.PI / 180 * ((vehicle.heading + 270) % 360);
            return new Style({
                image: new Icon({
                    anchor: [24 / 68, 0.5],
                    color: '#0000FF',
                    imgSize: [64, 44],
                    rotation: rot,
                    scale: 0.6,
                    src: 'assets/vehicle-icon-white-64.svg',
                }),
                text: new Text({
                    fill: new Fill({ color: '#FFFFFF' }),
                    font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
                    // rotation: rot,
                    text: vehicle.name.split(' ')[0],
                }),
                zIndex: 996,
            });
        }
        return undefined;
    },
};
export class OlUtil {

    public static createVehicleMarkerStyle(selected: boolean = false): StyleFunction {
        return (p0: FeatureLike, p1: number): Style => {
            const vehicle: IVehicleLocation = p0.get('vehicle');
            // eslint-disable-next-line eqeqeq
            if (vehicle != undefined) {
                const rot: number = Math.PI / 180 * ((vehicle.heading + 270) % 360);
                return new Style({
                    image: new Icon({
                        anchor: [24 / 68, 0.5],
                        color: selected ? '#0000FF' : '#FF0000',
                        imgSize: [64, 44],
                        rotation: rot,
                        scale: 0.6,
                        src: 'assets/vehicle-icon-white-64.svg',
                    }),
                    text: new Text({
                        fill: new Fill({ color: '#FFFFFF' }),
                        font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
                        // rotation: rot,
                        text: vehicle.name.split(' ')[0],
                    }),
                    zIndex: 995,
                });
            }
            return undefined;
        };
    }
    public static createStopMarkerStyle(selected: boolean = false): Style {
        return selected ? DEFAULT_STYLES.stop_selected as Style : DEFAULT_STYLES.stop as Style;
    }
    public static createStyleByFeature(feature: FeatureLike): StyleLike {
        // eslint-disable-next-line eqeqeq
        if (feature.get('type') != undefined) {
            return OlUtil.createStyleByType(feature.get('type'));
        }
        return undefined;
    }
    public static createStyleByType(feature: string): StyleLike {
        switch (feature) {
            case 'stopPoint':
            case 'stop':
                return DEFAULT_STYLES.stop;
            case 'stop_selected':
                return DEFAULT_STYLES.stop_selected;
            case 'vehicle':
                return DEFAULT_STYLES.vehicle;
            case 'vehicle_selected':
                return DEFAULT_STYLES.vehicle_selected;
            default:
                return DEFAULT_STYLES[feature];
        }
    }

    public static convertArcMSToCoordinate(sourceCoordinate: TrapezeCoord): Coordinate {
        const tmpCoord: any = sourceCoordinate;
        if (tmpCoord.lat && tmpCoord.lon) {
            return fromLonLat([tmpCoord.lon / 3600000, tmpCoord.lat / 3600000]);
        } else if (tmpCoord.latitude && tmpCoord.longitude) {
            return fromLonLat([tmpCoord.longitude / 3600000, tmpCoord.latitude / 3600000]);
        } else {
            throw new Error('Invalid coordinates');
        }
    }
}
