/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, Event as RouterEvent } from '@angular/router';
import { NextObserver } from 'rxjs';
import { SidebarService } from 'src/app/modules/sidebar';
import { ToolbarSearchBoxComponent } from './search-box.component';

// tslint:disable:max-classes-per-file
export class NavigationSubscriber implements NextObserver<RouterEvent> {
    public constructor(private toolbar: MainToolbarComponent) {}
    public next(event: RouterEvent): void {
        if (event instanceof NavigationEnd && event.url.length > 1) {
            this.toolbar.closeable = true;
        } else if (event instanceof NavigationStart) {
            this.toolbar.closeable = false;
        }
    }
}

@Component({
    selector: 'app-main-toolbar',
    styleUrls: ['./main-toolbar.component.scss'],
    templateUrl: './main-toolbar.component.html',
})
export class MainToolbarComponent {
    public get searchOpen(): boolean {
        return this.mSearchOpen;
    }

    public set searchOpen(open: boolean) {
        this.mSearchOpen = open;
    }
    public closeable = false;
    @ViewChild(ToolbarSearchBoxComponent)
    private searchBoxComponent: ToolbarSearchBoxComponent;

    private mSearchOpen = false;

    constructor(
        private sidebarService: SidebarService,
        private router: Router
    ) {
        this.router.events.subscribe(new NavigationSubscriber(this));
    }

    public toggleSidebar(): void {
        this.sidebarService.toggleSidebar();
    }

    public onFocusSearch(event: boolean): void {
        this.searchOpen = event;
    }
    public toggleSearch(): void {
        if (this.searchBoxComponent) {
            // this.searchBoxComponent.doFocusSearch();
        }
    }
}
