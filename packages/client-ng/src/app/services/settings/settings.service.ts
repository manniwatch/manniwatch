/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import deepmerge from 'deepmerge';
import { Coordinate } from 'ol/coordinate';
import { combineLatest, of, BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { deepFreezeObject } from 'src/app/util';
import { OlUtil } from 'src/app/util/ol';
import { LOCAL_STORAGE_TOKEN } from 'src/app/util/storage';
import { IStorage } from 'src/app/util/storage/storage';
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
    constructor(public httpClient: HttpClient,
        @Inject(LOCAL_STORAGE_TOKEN) public lStorage: IStorage) {
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

    /**
     * Config from which all non compile time settings should be resolved
     */
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
     * Persists the theme preference in storageProvider
     * @param theme theme to store
     */
    protected setThemePreference(theme: Theme): void {
        switch (theme) {
            case Theme.DARK:
                this.lStorage.setItem('theme', 'dark');
                break;
            case Theme.LIGHT:
                this.lStorage.setItem('theme', 'light');
                break;
            default:
                this.lStorage.removeItem('theme');
                break;
        }
    }

    /**
     * Retrieves the theme preference from the storageProvider
     */
    protected getThemePreference(): Theme {
        switch (this.lStorage.getItem('theme')) {
            case 'dark':
                return Theme.DARK;
            case 'light':
                return Theme.LIGHT;
            default:
                return Theme.DEFAULT;
        }
    }

    public getInitialMapCenter(): Coordinate {
        if (this.config?.map?.center) {
            return OlUtil.convertArcMSToCoordinate(this.config.map.center);
        }
        return OlUtil.convertArcMSToCoordinate({
            lat: 0,
            lon: 0,
        });
    }
    public getInitialMapZoom(): number {
        if (typeof this.config?.map?.zoom === 'number') {
            return this.config.map.zoom;
        }
        return 13;
    }
}
