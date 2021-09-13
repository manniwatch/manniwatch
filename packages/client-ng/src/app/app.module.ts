/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ClassProvider, ErrorHandler, FactoryProvider, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MainToolbarModule } from 'src/app/modules/main-toolbar';
import { SidebarModule } from 'src/app/modules/sidebar';
import { ApiService, ElectronApiService, SettingsService, SETTINGS_SERVICE_FACTORY } from 'src/app/services';
import { environment } from '../environments';
import { AppErrorHandler } from './app-error-handler';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMapModule } from './modules/main-map';
import { WebApiService } from './services';
import { AppNotificationService } from './services/app-notification.service';
import { StopPointService } from './services/stop-point.service';
import { UserLocationService } from './services/user-location.service';
import { getManniwatchDesktopApi, isManniwatchDesktop } from './util/electron';

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

const API_FACTORY_PROVIDER: FactoryProvider = {
    deps: [HttpClient, SettingsService],
    provide: ApiService,
    useFactory: (http: HttpClient, config: SettingsService): ApiService => {
        if (isManniwatchDesktop()) {
            return new ElectronApiService(getManniwatchDesktopApi());
        } else {
            return new WebApiService(http, config);
        }
    },
};
const SETTINGS_FACTORY_PROVIDER: FactoryProvider = {
    deps: [SettingsService],
    multi: true,
    provide: APP_INITIALIZER,
    useFactory: SETTINGS_SERVICE_FACTORY,
};

const ERROR_HANDLER_PROVIDER: ClassProvider = {
    provide: ErrorHandler,
    useClass: AppErrorHandler,
};

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
        ERROR_HANDLER_PROVIDER,
        API_FACTORY_PROVIDER,
        SETTINGS_FACTORY_PROVIDER,
    ],
})
export class AppModule { }
