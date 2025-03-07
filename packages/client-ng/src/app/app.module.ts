/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ClassProvider, ErrorHandler, FactoryProvider, NgModule, inject, provideAppInitializer } from '@angular/core';
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
import { AppErrorHandler } from './app-error-handler';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMapModule } from './modules/main-map';
import { WebApiService } from './services';
import { AppNotificationService } from './services/app-notification.service';
import { StopPointService } from './services/stop-point.service';
import { UserLocationService } from './services/user-location.service';
import { getManniwatchDesktopApi, isManniwatchDesktop } from './util/electron';
import { localStorageFactory, LOCAL_STORAGE_TOKEN } from './util/storage';
import { environment } from '../environments';

const moduleImports: NgModule['imports'] = [
    BrowserModule,
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
const SETTINGS_FACTORY_PROVIDER: FactoryProvider = provideAppInitializer(() => {
        const initializerFn = (SETTINGS_SERVICE_FACTORY)(inject(SettingsService));
        return initializerFn();
      });

const BROWSER_LOCAL_STORAGE_PROVIDER: FactoryProvider = {
    provide: LOCAL_STORAGE_TOKEN,
    useFactory: localStorageFactory,
};
const ERROR_HANDLER_PROVIDER: ClassProvider = {
    provide: ErrorHandler,
    useClass: AppErrorHandler,
};

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: moduleImports,
    providers: [
        StopPointService,
        UserLocationService,
        SettingsService,
        AppNotificationService,
        ERROR_HANDLER_PROVIDER,
        API_FACTORY_PROVIDER,
        SETTINGS_FACTORY_PROVIDER,
        BROWSER_LOCAL_STORAGE_PROVIDER,
        provideHttpClient(),
    ],
})
export class AppModule {}
