/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { fromLonLat } from 'ol/proj';
import { LOCAL_STORAGE_TOKEN } from 'src/app/util/storage';
import { IStorage } from 'src/app/util/storage/storage';
import { environment } from 'src/environments';
import { Environment } from 'src/environments/environment.base';
import { SettingsService } from './settings.service';
import { ApiService, Theme } from '..';

describe('src/app/services/settings.service', (): void => {
    describe('SettingsService', (): void => {
        let settingsService: SettingsService;
        let getSettingsSpy: jasmine.Spy<jasmine.Func>;
        let httpMock: HttpTestingController;
        let storageSpy: jasmine.SpyObj<IStorage>;
        beforeAll((): void => {
            getSettingsSpy = jasmine.createSpy();
        });
        beforeEach(waitForAsync((): void => {
            storageSpy = jasmine.createSpyObj<IStorage>('StorageSpy', ['getItem', 'setItem', 'removeItem']);
            TestBed.configureTestingModule({
                imports: [],
                providers: [
                    SettingsService,
                    {
                        provide: ApiService,
                        useValue: {
                            getSettings: getSettingsSpy,
                        },
                    },
                    {
                        provide: LOCAL_STORAGE_TOKEN,
                        useValue: storageSpy,
                    },
                    provideHttpClient(withInterceptorsFromDi()),
                    provideHttpClientTesting(),
                ],
            });
            settingsService = TestBed.inject(SettingsService);
            httpMock = TestBed.inject(HttpTestingController);
        }));

        afterEach((): void => {
            getSettingsSpy.calls.reset();
            // check for oustanding requests
            httpMock.verify();
        });
        describe('getInitialMapCenter()', (): void => {
            it(`should return LatLon(0,0) as default map center`, (): void => {
                expect(settingsService.config).toBeUndefined();
                expect(settingsService.getInitialMapCenter()).toEqual(fromLonLat([0, 0]));
            });
            it(`should return LatLon(0,0) as default map center`, (): void => {
                expect(settingsService.config).toBeUndefined();
                spyOnProperty(settingsService, 'config', 'get').and.returnValue({
                    map: {
                        center: {
                            lat: 7200000,
                            lon: 3600000,
                        },
                    },
                } as Environment);
                expect(settingsService.getInitialMapCenter()).toEqual(fromLonLat([1, 2]));
            });
        });
        describe('getInitialMapZoom()', (): void => {
            it(`should return zoom level 15`, (): void => {
                expect(settingsService.config).toBeUndefined();
                spyOnProperty(settingsService, 'config', 'get').and.returnValue({
                    map: {
                        zoom: 15,
                    },
                } as Environment);
                expect(settingsService.getInitialMapZoom()).toEqual(15);
            });
            it(`should return zoom level 0`, (): void => {
                expect(settingsService.config).toBeUndefined();
                spyOnProperty(settingsService, 'config', 'get').and.returnValue({
                    map: {
                        zoom: 0,
                    },
                } as Environment);
                expect(settingsService.getInitialMapZoom()).toEqual(0);
            });
            it(`should return default zoom level 13`, (): void => {
                expect(settingsService.config).toBeUndefined();
                expect(settingsService.getInitialMapZoom()).toEqual(13);
            });
        });
        describe('setThemePreference()', (): void => {
            it(`should set the theme to dark mode`, (): void => {
                expect(storageSpy.setItem.calls.count()).toEqual(0);
                settingsService.theme = Theme.DARK;
                expect(storageSpy.setItem.calls.count()).toEqual(1);
                expect(storageSpy.removeItem.calls.count()).toEqual(0);
                expect(storageSpy.setItem.calls.argsFor(0)).toEqual(['theme', 'dark']);
            });
            it(`should set the theme to light mode`, (): void => {
                expect(storageSpy.setItem.calls.count()).toEqual(0);
                settingsService.theme = Theme.LIGHT;
                expect(storageSpy.setItem.calls.count()).toEqual(1);
                expect(storageSpy.removeItem.calls.count()).toEqual(0);
                expect(storageSpy.setItem.calls.argsFor(0)).toEqual(['theme', 'light']);
            });
            it(`should remove the theme preference for unknown values`, (): void => {
                expect(storageSpy.setItem.calls.count()).toEqual(0);
                settingsService.theme = -2000 as Theme;
                expect(storageSpy.setItem.calls.count()).toEqual(0);
                expect(storageSpy.removeItem.calls.count()).toEqual(1);
                expect(storageSpy.removeItem.calls.argsFor(0)).toEqual(['theme']);
            });
        });
        describe('load()', (): void => {
            it('should store a successful response', (done: DoneFn): void => {
                const mockResponse: object = {
                    completed: false,
                    id: 2,
                    title: 'Title',
                };
                expect(settingsService.baseConfig).toBeUndefined();
                settingsService.load().subscribe((): void => {
                    expect(settingsService.baseConfig).toEqual(mockResponse);
                    done();
                });

                const mockRequest: TestRequest = httpMock.expectOne(environment.configUrl || '/config/config.json');
                mockRequest.flush(mockResponse);
            });
            it('should not set unsuccessful response', (done: DoneFn): void => {
                expect(settingsService.baseConfig).toBeUndefined();
                settingsService.load().subscribe((): void => {
                    expect(settingsService.baseConfig).toEqual({});
                    done();
                });

                const mockRequest: TestRequest = httpMock.expectOne(environment.configUrl || '/config/config.json');
                mockRequest.flush(
                    {},
                    {
                        status: 404,
                        statusText: 'Not found',
                    }
                );
            });
        });
    });
});
