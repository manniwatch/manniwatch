/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments';

export function ConfigServiceFactory(config: ConfigService): () => Observable<void> {
    return () => config.load();
}

export interface IConfig {
    apiBasePath: string;
}
@Injectable(
    { providedIn: 'root' },
)
export class ConfigService {

    private config: Partial<IConfig>;

    constructor(public httpClient: HttpClient) {
    }

    /**
     * Function loading initial config
     * @returns Observable
     */
    public load(): Observable<void> {
        const configPath: string = environment.configPath || '/config/config.json';
        return this.httpClient
            .get(configPath)
            .pipe(map((resp: IConfig) => {
                this.config = resp;
                console.info('Config loaded');
            }), catchError((err: any): Observable<void> => {
                console.group(`Unable to load config`);
                console.log(`Path: ${configPath}`);
                if (err instanceof HttpErrorResponse && err.status !== 200) {
                    console.error(`Status Code: ${err.status}`);
                } else {
                    console.error('Reason:', err);
                }
                console.groupEnd();
                this.config = {};
                return EMPTY;
            }));
    }

    /**
     * Retrieves the api path
     * @returns {string} Api Path
     */
    public get apiBasePath(): string {
        return this?.config?.apiBasePath || environment.apiEndpoint;
    }
}
