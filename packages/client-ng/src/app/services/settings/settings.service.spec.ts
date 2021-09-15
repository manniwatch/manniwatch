/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { fromLonLat } from 'ol/proj';
import { environment } from 'src/environments';
import { ApiService } from '..';
import { SettingsService } from './settings.service';
// import sinon from "sinon";

describe('src/app/services/settings.service', (): void => {
    describe('SettingsService', (): void => {
        let settingsService: SettingsService;
        let getSettingsSpy: jasmine.Spy<jasmine.Func>;
        let httpMock: HttpTestingController;
        beforeAll((): void => {
            getSettingsSpy = jasmine.createSpy();
        });
        beforeEach(waitForAsync((): void => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                ],
                providers: [
                    SettingsService,
                    {
                        provide: ApiService,
                        useValue: {
                            getSettings: getSettingsSpy,
                        },
                    },
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
                });
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
                });
                expect(settingsService.getInitialMapZoom()).toEqual(15);
            });
            it(`should return zoom level 0`, (): void => {
                expect(settingsService.config).toBeUndefined();
                spyOnProperty(settingsService, 'config', 'get').and.returnValue({
                    map: {
                        zoom: 0,
                    },
                });
                expect(settingsService.getInitialMapZoom()).toEqual(0);
            });
            it(`should return default zoom level 13`, (): void => {
                expect(settingsService.config).toBeUndefined();
                expect(settingsService.getInitialMapZoom()).toEqual(13);
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

                const mockRequest: TestRequest = httpMock.expectOne(
                    environment.configUrl || '/config/config.json',
                );
                mockRequest.flush(mockResponse);
            });
            it('should not set unsuccessful response', (done: DoneFn): void => {

                expect(settingsService.baseConfig).toBeUndefined();
                settingsService.load().subscribe((): void => {
                    expect(settingsService.baseConfig).toEqual({});
                    done();
                });

                const mockRequest: TestRequest = httpMock.expectOne(
                    environment.configUrl || '/config/config.json',
                );
                mockRequest.flush({}, {
                    status: 404,
                    statusText: 'Not found',
                });
            });
        });
    });
});
