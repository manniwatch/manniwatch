/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments';
import { ApiService } from './api.service';
import { SettingsService } from './settings.service';
// import * as sinon from "sinon";

describe('src/app/services/settings.service', (): void => {
    describe('SettingsService', (): void => {
        let settingsService: SettingsService;
        let getSettingsSpy: jasmine.Spy<jasmine.Func>;
        beforeAll((): void => {
            getSettingsSpy = jasmine.createSpy();
        });
        beforeEach(async((): void => {
            TestBed.configureTestingModule({
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
        }));

        afterEach((): void => {
            getSettingsSpy.calls.reset();
        });
        describe('getInitialMapZoom()', (): void => {
            interface ITestValue {
                settings?: {
                    lat?: number,
                    lon?: number,
                };
                out: {
                    lat: number,
                    lon: number,
                };
            }
            const testValues: ITestValue[] = [{
                out: {
                    lat: 0,
                    lon: 0,
                },
            }, {
                out: {
                    lat: 0,
                    lon: 0,
                },
                settings: {

                },
            }, {
                out: {
                    lat: 0,
                    lon: 0,
                },
                settings: {
                    lat: 20,
                },
            }, {
                out: {
                    lat: 0,
                    lon: 0,
                },
                settings: {
                    lon: 5005,
                },
            }, {
                out: {
                    lat: 49383292 / 3600000,
                    lon: 2039290 / 3600000,
                },
                settings: {
                    lat: 49383292,
                    lon: 2039290,
                },
            }];
            testValues.forEach((testValue: ITestValue): void => {
                it('should return LatLon(' + testValue.out.lat + ',' + testValue.out.lon + ')', (): void => {
                    (environment.map.center as any) = testValue.settings;
                    expect(settingsService.getInitialMapCenter()).toEqual([testValue.out.lon, testValue.out.lat]);
                });
            });
        });
        describe('getInitialMapZoom()', (): void => {
            const testValues: {
                settings: boolean,
                value?: number,
            }[] = [];
            testValues.forEach((testValue: {
                settings: boolean,
                value?: number,
            }): void => {
                it('should return zoom level ' + (testValue.value ? testValue.value : 20), (): void => {
                    if (testValue.settings) {
                        (settingsService as any).mSettings = {
                            INITIAL_ZOOM: testValue.value,
                        };
                        expect(settingsService.getInitialMapZoom()).toEqual(testValue.value ? testValue.value : 20);
                    } else {
                        (settingsService as any).mSettings = undefined;
                        expect(settingsService.getInitialMapZoom()).toEqual(20);
                    }
                });
            });
        });
    });
});
