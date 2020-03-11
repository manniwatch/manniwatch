/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments';
import { AppErrorHandler } from './app-error-handler';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMapModule } from './modules/main-map';
import { MainToolbarModule } from './modules/main-toolbar/main-toolbar.module';
import { SidebarModule } from './modules/sidebar/sidebar.module';
import { ApiService } from './services';
import { AppNotificationService } from './services/app-notification.service';
import { NginxApiService } from './services/nginx-api.service';
import { SettingsService } from './services/settings.service';
import { StopPointService } from './services/stop-point.service';
import { UserLocationService } from './services/user-location.service';

export const SETTINGS_INITIALIZER: (appInitService: SettingsService) => () => Promise<void> =
    (appInitService: SettingsService): () => Promise<void> =>
        (): Promise<any> =>
            appInitService.load();
const moduleImports: any[] = [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    AppRoutingModule,
    MatIconModule,
    MatInputModule,
    MainMapModule,
    MainToolbarModule,
    MatSnackBarModule,
    SidebarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production && environment.pwa,
    }),
];
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
    ],
    imports: moduleImports,
    providers: [
        StopPointService,
        UserLocationService,
        SettingsService,
        AppNotificationService,
        {
            deps: [SettingsService],
            multi: true,
            provide: APP_INITIALIZER,
            useFactory: SETTINGS_INITIALIZER,
        },
        {
            provide: ErrorHandler,
            useClass: AppErrorHandler,
        },
        {
            provide: ApiService,
            useClass: NginxApiService,
        },
    ],
})
export class AppModule { }
