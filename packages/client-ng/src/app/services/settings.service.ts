/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { Subscriber, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { environment } from 'src/environments';
import { createCssThemeWatcher } from './css-theme-watcher';
import { Theme } from './theme';
import { map } from 'rxjs/operators';

// tslint:disable:max-classes-per-file
export class SettingsLoadSubscriber extends Subscriber<void> {
    public constructor(private resolve: (arg: void) => void) {
        super();
    }

    public error(err: any): void {
        this.resolve();
        // tslint:disable-next-line:no-console
        console.error(err);
    }

    public complete(): void {
        this.resolve();
    }
}

@Injectable(
    { providedIn: 'root' },
)
export class SettingsService {

    public readonly themeObservable: Observable<Theme>;
    private themeSubject: BehaviorSubject<Theme>;
    private cssThemeObservable: Observable<Theme>;
    constructor() {
        this.themeSubject = new BehaviorSubject(this.getThemePreference());
        this.cssThemeObservable = createCssThemeWatcher();
        this.themeObservable = combineLatest([this.themeSubject, this.cssThemeObservable])
            .pipe(map((themes: [Theme, Theme]): Theme => {
                if (themes[0] === Theme.DEFAULT) {
                    return themes[1];
                }
                return themes[0];
            }));
    }

    public setTheme(theme: Theme): void {
        this.themeSubject.next(theme);
        this.setThemePreference(theme);
    }

    /**
     * Persists the theme preference in localStorage
     * @param theme theme to store
     */
    protected setThemePreference(theme: Theme): void {
        switch (theme) {
            case Theme.DARK:
                localStorage.setItem('theme', 'dark');
                break;
            case Theme.LIGHT:
                localStorage.setItem('theme', 'light');
                break;
            default:
                localStorage.removeItem('theme');
                break;
        }
    }

    /**
     * Retrieves the theme preference from localStorage
     */
    protected getThemePreference(): Theme {
        switch (localStorage.getItem('theme')) {
            case 'dark':
                return Theme.DARK;
            case 'light':
                return Theme.LIGHT;
            default:
                return Theme.DEFAULT;
        }
    }

    public getInitialMapCenter(): [number, number] {
        if (environment.map &&
            environment.map.center &&
            environment.map.center.lat &&
            environment.map.center.lon) {
            return [environment.map.center.lon / 3600000, environment.map.center.lat / 3600000];
        }
        return [0, 0];
    }
    public getInitialMapZoom(): number {
        if (environment.map) {
            return environment.map.zoom;
        }
        return 13;
    }
}
