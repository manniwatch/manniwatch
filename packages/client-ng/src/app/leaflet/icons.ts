/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Location } from '@angular/common';
import * as L from 'leaflet';
import { STOP_ICON_SHADOW_URL, STOP_ICON_URL } from './constants';
/**
 * Creates an StopIcon instance to be used for leaflet markers
 * @param iconSize icon size in pixels
 */
export const createStopIcon: (location: Location, iconSize?: number) => L.Icon = (location: Location, iconSize: number = 24): L.Icon =>
    L.icon({
        iconAnchor: [iconSize / 2, iconSize / 2], // point of the icon which will correspond to marker's location
        // shadowUrl: 'leaf-shadow.png',
        iconSize: [iconSize, iconSize], // size of the icon
        iconUrl: location.prepareExternalUrl(STOP_ICON_URL),
        popupAnchor: [iconSize / 2, iconSize / 2], // point from which the popup should open relative to the iconAnchor
        shadowAnchor: [iconSize / 7 * 3, iconSize / 7 * 3],  // the same for the shadow
        shadowSize: [iconSize * 1.1, iconSize * 1.1], // size of the shadow
        shadowUrl: location.prepareExternalUrl(STOP_ICON_SHADOW_URL),
    });

/**
 * Creates an vehicle icon to be used for leaflet markers
 * @param heading in degrees
 * @param name Name to be displayed inside icon
 * @param iconSize icon size in pixels
 */
export const createVehicleIcon: (heading: number, name: string, iconSize?: number) => L.DivIcon =
    (heading: number, name: string, iconSize: number = 40) =>
        L.divIcon({
            className: heading > 180 ? 'vehiclemarker-rotated' : 'vehiclemarker',
            html: '<span>' + name.split(' ')[0] + '</span>',
            iconAnchor: [iconSize / 2, Math.round(iconSize / 2 / 68 * 44)], // point of the icon which will correspond to marker's location
            iconSize: [iconSize, Math.round(iconSize / 68 * 44)], // size of the icon
            popupAnchor: [12, 12], // point from which the popup should open relative to the iconAnchor
            shadowAnchor: [32, 32],  // the same for the shadow
            shadowSize: [24, 24], // size of the shadow
        });
