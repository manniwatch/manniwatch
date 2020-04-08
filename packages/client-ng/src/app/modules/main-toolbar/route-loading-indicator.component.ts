/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    Event,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
} from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';

// tslint:disable:max-classes-per-file
export class RouteLoadingSubscriber extends Subscriber<Event> {

    constructor(private indicatorCmp: RouteLoadingIndicatorComponent) {
        super();
    }
    next(value?: Event): void {
        switch (true) {
            case value instanceof NavigationStart:
                this.indicatorCmp.loading = true;
                break;
            case value instanceof NavigationEnd:
            case value instanceof NavigationCancel:
            case value instanceof NavigationError:
                this.indicatorCmp.loading = false;
                break;
        }
    }
}

@Component({
    selector: 'app-route-loading-indicator',
    styleUrls: ['./route-loading-indicator.component.scss'],
    templateUrl: './route-loading-indicator.component.html',
})
export class RouteLoadingIndicatorComponent implements OnInit, OnDestroy {

    public loading: boolean = false;
    private subscription: Subscription;
    constructor(private router: Router) {

    }
    public ngOnInit(): void {
        this.subscription = this.router
            .events
            .subscribe(new RouteLoadingSubscriber(this));
    }

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
