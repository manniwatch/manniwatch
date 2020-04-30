/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, VERSION } from '@angular/core';
import { environment } from 'src/environments';
import { SidebarService } from './sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { RequestUpdateDialogComponent } from '../request-update-dialog';

@Component({
    selector: 'app-sidebar',
    styleUrls: ['./sidebar.component.scss'],
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
    public constructor(private sidebarService: SidebarService,
        public dialog: MatDialog) {

    }

    public closeSidebar(): void {
        this.sidebarService.closeSidebar();
    }

    public openGithub(): void {
        window.open('https://github.com/manniwatch/manniwatch', '_blank');
    }

    /**
     * The app version found inside the package
     * @returns the package version
     */
    public get appVersion(): string {
        return environment.version;
    }

    /**
     * The @angular/core version used
     * @returns Version {@link VERSION.full}
     */
    public get angularVersion(): string {
        return VERSION.full;
    }

    public checkForUpdate(): void {
        this.dialog.open(RequestUpdateDialogComponent);
    }
}
