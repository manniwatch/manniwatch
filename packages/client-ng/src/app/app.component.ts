/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { SidebarService } from './services/sidebar.service';
@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

    public get isSidenavOpen(): boolean {
        return this.sidenav.opened;
    }
    prediction: any;

    @ViewChild(MatSidenavContainer, { static: true })
    sidenavContainer: MatSidenavContainer;
    @ViewChild(MatSidenav, { static: true })
    sidenav: MatSidenav;
    predictions: any;
    tripId: string;
    constructor(private sidebarService: SidebarService) {
    }
    public ngOnInit(): void {
        this.sidebarService.sidebarObservable
            .subscribe((open: boolean): void => {
                if (open) {
                    this.sidenav.open();
                } else {
                    this.sidenav.close();
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
    public onVoted(agreed: any): void {
        this.tripId = agreed.tripId;
    }

    public toggleSidebar(): void {
        this.sidenav.toggle();
    }

}
