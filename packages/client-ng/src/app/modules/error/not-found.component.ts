/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component } from '@angular/core';
@Component({
    selector: 'app-not-found',
    styleUrls: ['./not-found.component.scss'],
    templateUrl: './not-found.component.pug',
})
/**
 * Component to be displayed for Errors with non found resources.
 * Offers links to common entry points
 */
export class NotFoundComponent {

    /**
     * List of entry points
     */
    public readonly endpoints: {
        icon: string;
        path: string;
        title: string;
    }[] = [{
        icon: 'home',
        path: '/',
        title: 'Home',
    }, {
        icon: 'place',
        path: '/stops',
        title: 'Stops',
    }];
    constructor() {
    }
}
