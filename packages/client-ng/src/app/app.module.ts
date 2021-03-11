/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, Provider } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MainToolbarModule } from 'src/app/modules/main-toolbar';
import { SidebarModule } from 'src/app/modules/sidebar';
import { ApiService, ElectronApiService, ELECTRON_API, SettingsService } from 'src/app/services';
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
            provide: ErrorHandler,
            useClass: AppErrorHandler,
        },
        {
            deps: [HttpClient],
            provide: ApiService,
            useFactory: (http: HttpClient) => {
                if (isManniwatchDesktop()) {
                    return new ElectronApiService(getManniwatchDesktopApi());
                } else {
                    return new WebApiService(http);
                }
            },
        }
    ],
})
export class AppModule { }
