/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { Subscriber } from 'rxjs';
import { SidebarService } from 'src/app/services/sidebar.service';
import { ToolbarSearchBoxComponent } from './search-box.component';

// tslint:disable:max-classes-per-file
export class NavigationSubscriber extends Subscriber<RouterEvent> {

    public constructor(private toolbar: MainToolbarComponent) {
        super();
    }
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
    public closeable: boolean = false;
    @ViewChild(ToolbarSearchBoxComponent)
    private searchBoxComponent: ToolbarSearchBoxComponent;

    private mSearchOpen: boolean = false;

    constructor(private sidebarService: SidebarService,
        private router: Router) {
        this.router.events.subscribe(new NavigationSubscriber(this));
    }

    public toggleSidebar(): void {
        this.sidebarService.toggleSidebar();
    }

    public onFocusSearch(event: any): void {
        this.searchOpen = event;
    }
    public toggleSearch(): void {
        if (this.searchBoxComponent) {
            // this.searchBoxComponent.doFocusSearch();
        }
    }

}
