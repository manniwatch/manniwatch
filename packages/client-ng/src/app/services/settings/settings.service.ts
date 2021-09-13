/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import deepmerge from 'deepmerge';
import { combineLatest, of, BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { deepFreezeObject } from 'src/app/util';
import { environment } from 'src/environments';
import { Environment } from 'src/environments/environment.base';
import { Theme } from '../theme';
import { createCssThemeWatcher } from './css-theme-watcher';

export interface IConfig {
    apiBasePath?: string;
}

@Injectable(
    { providedIn: 'root' },
)
export class SettingsService {

    public readonly themeObservable: Observable<Theme>;
    private themeSubject: BehaviorSubject<Theme>;
    private cssThemeObservable: Observable<Theme>;
    private sourceConfig: Partial<IConfig>;
    private mergedConfig: IConfig & Environment;
    constructor(public httpClient: HttpClient) {
        this.themeSubject = new BehaviorSubject(this.getThemePreference());
        this.cssThemeObservable = createCssThemeWatcher();
        this.themeObservable = combineLatest([this.themeSubject, this.cssThemeObservable])
            .pipe(map((themes: [Theme, Theme]): Theme => {
                if (themes[0] === Theme.DEFAULT) {
                    return themes[1];
                }
                return themes[0];
            }), shareReplay(1));
        this.updateBodyTheme();
        this.themeObservable.subscribe((theme: Theme): void => {
            this.setBodyTheme(theme);
        });
    }

    /**
     * Function loading initial config
     * @returns Observable
     */
    public load(): Observable<void> {
        const configPath: string = environment.configUrl || '/config/config.json';
        return this.httpClient
            .get(configPath)
            .pipe(tap((resp: IConfig): void => {
                // tslint:disable-next-line:no-console
                console.info('Config loaded');
            }), catchError((err: any): Observable<IConfig> => {
                console.group(`Unable to load config`);
                console.log(`Path: ${configPath}`);
                if (err instanceof HttpErrorResponse && err.status !== 200) {
                    console.error(`Status Code: ${err.status}`);
                } else {
                    console.error('Reason:', err);
                }
                console.groupEnd();
                return of({});
            }), map((cfg: IConfig): void => {
                this.sourceConfig = cfg;
                this.mergedConfig = deepFreezeObject(deepmerge(environment, cfg));
            }));
    }

    public get baseConfig(): Partial<IConfig> {
        return this.sourceConfig;
    }

    public get config(): Environment {
        return this.mergedConfig;
    }
    public updateBodyTheme(): void {
        this.setBodyTheme(this.getThemePreference());
    }

    protected setBodyTheme(theme: Theme): void {
        const bodyElement: HTMLElement = document.body;
        switch (theme) {
            case Theme.DARK:
                bodyElement.setAttribute('theme', 'dark');
                break;
            case Theme.LIGHT:
                bodyElement.setAttribute('theme', 'light');
                break;
        }
    }

    /**
     * Returns the current theme
     */
    public get theme(): Theme {
        return this.themeSubject.value;
    }

    /**
     * Sets the current theme
     */
    public set theme(theme: Theme) {
        this.themeSubject.next(theme);
        this.setThemePreference(theme);
        this.setBodyTheme(theme);
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
