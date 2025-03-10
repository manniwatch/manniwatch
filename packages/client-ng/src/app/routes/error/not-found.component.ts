/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component } from '@angular/core';
@Component({
    selector: 'app-not-found',
    standalone: false,
    styleUrls: ['./not-found.component.scss'],
    templateUrl: './not-found.component.html',
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
    }[] = [
        {
            icon: 'home',
            path: '/',
            title: 'Home',
        },
        {
            icon: 'place',
            path: '/stops',
            title: 'Stops',
        },
    ];
}
