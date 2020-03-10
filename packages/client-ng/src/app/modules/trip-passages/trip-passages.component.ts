/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component } from '@angular/core';
import { TripPassagesService } from './trip-passages.service';
import {
    UpdateStatus,
} from './trip-util';

/**
 * Component displaying the TripPassages for a Trip
 */
@Component({
    providers: [
        TripPassagesService,
    ],
    selector: 'app-trip-passages',
    styleUrls: ['./trip-passages.component.scss'],
    templateUrl: './trip-passages.component.pug',
})
export class TripPassagesComponent {

    public readonly STATUS_OPS: typeof UpdateStatus = UpdateStatus;
    constructor(public readonly passageService: TripPassagesService) { }

}
