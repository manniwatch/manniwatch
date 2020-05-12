/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MainToolbarModule } from 'src/app/modules/main-toolbar';
import { SidebarModule } from 'src/app/modules/sidebar';
import { ApiService, SettingsService } from 'src/app/services';
import { environment } from '../environments';
import { AppErrorHandler } from './app-error-handler';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMapModule } from './modules/main-map';
import { WebApiService } from './services';
import { AppNotificationService } from './services/app-notification.service';
import { StopPointService } from './services/stop-point.service';
import { UserLocationService } from './services/user-location.service';

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
            provide: ApiService,
            useClass: WebApiService,
        },
    ],
})
export class AppModule { }
