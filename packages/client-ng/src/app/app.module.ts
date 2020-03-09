import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { MatIconModule, MatInputModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppErrorHandler } from './app-error-handler';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawableDirective } from './drawable.directive';
import { MainMapModule } from './modules/main-map';
import { MainToolbarModule } from './modules/main-toolbar/main-toolbar.module';
import { SidebarModule } from './modules/sidebar/sidebar.module';
import { AppNotificationService } from './services/app-notification.service';
import { SettingsService } from './services/settings.service';
import { StopPointService } from './services/stop-point.service';
import { UserLocationService } from './services/user-location.service';

export const SETTINGS_INITIALIZER = (appInitService: SettingsService) =>
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
    SidebarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production && environment.pwa,
    }),
];
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        DrawableDirective,
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
    ],
})
export class AppModule { }
