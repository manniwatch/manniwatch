/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, VERSION } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { environment } from 'src/environments';
@Component({
    selector: 'app-sidebar',
    styleUrls: ['./sidebar.component.scss'],
    templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
    public constructor(private sidebarService: SidebarService) {

    }

    public closeSidebar(): void {
        this.sidebarService.closeSidebar();
    }

    public openGithub(): void {
        window.open('https://github.com/donmahallem/TrapezeClientNg', '_blank');
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
}
