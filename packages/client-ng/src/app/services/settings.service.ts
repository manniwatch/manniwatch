import { Injectable } from '@angular/core';
import { ISettings } from '@donmahallem/trapeze-api-types';
import { from, Observable, Subscriber, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

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

    private mSettings: ISettings = undefined;

    constructor(private apiService: ApiService) {

    }

    public get settings(): ISettings {
        return this.mSettings;
    }

    public getInitialMapCenter(): [number, number] {
        if (this.settings &&
            this.settings.INITIAL_LAT &&
            this.settings.INITIAL_LON) {
            return [this.settings.INITIAL_LON / 3600000, this.settings.INITIAL_LAT / 3600000];
        }
        return [0, 0];
    }
    public getInitialMapZoom(): number {
        if (this.settings && this.settings.INITIAL_ZOOM) {
            return this.settings.INITIAL_ZOOM;
        }
        return 13;
    }

    public load(): Promise<void> {
        return new Promise((resolve: (arg: void) => void, reject: (err: any) => void): Subscription =>
            this.apiService.getSettings()
                .pipe(tap((value: ISettings): void => {
                    this.mSettings = value;
                }),
                    map((value: ISettings): void => {
                        return;
                    }),
                    catchError((err: any): Observable<any> =>
                        from([undefined])))
                .subscribe(new SettingsLoadSubscriber(resolve)));
    }
}
