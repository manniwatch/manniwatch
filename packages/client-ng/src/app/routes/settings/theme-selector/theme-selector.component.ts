/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { SettingsService, Theme } from 'src/app/services';

@Component({
    selector: 'app-theme-selector',
    styleUrls: ['./theme-selector.component.scss'],
    templateUrl: './theme-selector.component.html',
})
export class ThemeSelectorComponent implements OnInit, OnDestroy {

    public theme: Theme;
    private themeSubscription: Subscription;
    public constructor(public settingsService: SettingsService) {

    }
    public selectTheme(theme: Theme): void {
        this.settingsService.theme = theme;
    }

    public onSelectionChange(change: MatSelectionListChange): void {
        const value: Theme = change.options[0].value;
        this.settingsService.theme = value;
    }

    public ngOnInit(): void {
        this.themeSubscription = this.settingsService
            .themeObservable
            .subscribe({
                next: (theme: Theme): void => {
                    this.theme = theme;
                },
            });
    }

    public ngOnDestroy(): void {
        if (this.themeSubscription) {
            this.themeSubscription.unsubscribe();
        }
    }
}
