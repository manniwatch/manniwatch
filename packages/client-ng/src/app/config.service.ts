/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpClient } from '@angular/common/http';
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

    private config: IConfig;

    constructor(public httpClient: HttpClient) {
    }


    public load(): Observable<void> {
        return this.httpClient
            .get(environment.configPath || '/config/config.json')
            .pipe(map((resp: IConfig) => {
                this.config = resp;
                console.info('Config loaded');
            }), catchError((err: any): Observable<void> => {
                console.error('Unable to load config', err);
                return EMPTY;
            }));
    }

    public get apiBasePath(): string {
        return this?.config?.apiBasePath || environment.apiEndpoint;
    }
}
