/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component } from '@angular/core';
import { SettingsService, Theme } from 'src/app/services';

@Component({
    selector: 'app-theme-selector',
    styleUrls: ['./theme-selector.component.scss'],
    templateUrl: './theme-selector.component.html',
})
export class ThemeSelectorComponent {

    public constructor(public settingsService: SettingsService) {

    }
    public selectTheme(theme: Theme): void {
        this.settingsService.setTheme(theme);
    }
}
