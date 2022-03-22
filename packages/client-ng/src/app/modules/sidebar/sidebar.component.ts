/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component, VERSION } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments';
import { RequestUpdateDialogComponent } from '../request-update-dialog';
import { SidebarService } from './sidebar.service';

@Component({
    selector: 'app-sidebar',
    styleUrls: ['./sidebar.component.scss'],
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
    public constructor(private sidebarService: SidebarService, public dialog: MatDialog) {}

    public closeSidebar(): void {
        this.sidebarService.closeSidebar();
    }

    public openGithub(): void {
        window.open('https://github.com/manniwatch/manniwatch', '_blank');
    }

    /**
     * The app version found inside the package
     *
     * @returns the package version
     */
    public get appVersion(): string {
        return environment.version;
    }

    /**
     * The @angular/core version used
     *
     * @returns Version
     */
    public get angularVersion(): string {
        return VERSION.full;
    }

    public checkForUpdate(): void {
        this.dialog.open(RequestUpdateDialogComponent);
    }
}
