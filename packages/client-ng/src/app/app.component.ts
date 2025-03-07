/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { TripInfoWithId } from '@manniwatch/client-types';
import { SidebarService } from 'src/app/modules/sidebar';
@Component({
    selector: 'app-root',
    standalone: false,
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    public get isSidenavOpen(): boolean {
        return this.sidenav.opened;
    }
    prediction: unknown;

    @ViewChild(MatSidenavContainer, { static: true })
    sidenavContainer: MatSidenavContainer;
    @ViewChild(MatSidenav, { static: true })
    sidenav: MatSidenav;
    predictions: unknown;
    tripId: string;
    constructor(private sidebarService: SidebarService) {}
    public ngOnInit(): void {
        this.sidebarService.sidebarObservable.subscribe((open: boolean): void => {
            if (open) {
                void this.sidenav.open();
            } else {
                void this.sidenav.close();
            }
        });
        this.sidenav.openedChange.subscribe((open: boolean): void => {
            if (open) {
                this.sidebarService.openSidebar();
            } else {
                this.sidebarService.closeSidebar();
            }
        });
    }

    public onVoted(agreed: TripInfoWithId): void {
        this.tripId = agreed.tripId;
    }

    public toggleSidebar(): void {
        void this.sidenav.toggle();
    }
}
