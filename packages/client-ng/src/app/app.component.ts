/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material';
import { DrawableDirective } from './drawable.directive';
import { SidebarService } from './services/sidebar.service';
@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.pug',
})
export class AppComponent implements OnInit {

    public get isSidenavOpen(): boolean {
        return this.sidenav.opened;
    }
    title = 'app';
    prediction: any;

    @ViewChild(MatSidenavContainer, { static: true })
    sidenavContainer: MatSidenavContainer;
    @ViewChild(MatSidenav, { static: true })
    sidenav: MatSidenav;
    predictions: any;
    tripId: string;
    @ViewChild(DrawableDirective, { static: false }) canvas;
    constructor(private sidebarService: SidebarService) {
    }
    ngOnInit() {
        this.sidebarService.sidebarObservable
            .subscribe((open) => {
                if (open) {
                    this.sidenav.open();
                } else {
                    this.sidenav.close();
                }
            });
        this.sidenav.openedChange.subscribe((open) => {
            if (open) {
                this.sidebarService.openSidebar();
            } else {
                this.sidebarService.closeSidebar();
            }
        });
    }
    onVoted(agreed: any) {
        this.tripId = agreed.tripId;
    }

    public toggleSidebar(): void {
        this.sidenav.toggle();
    }

}
