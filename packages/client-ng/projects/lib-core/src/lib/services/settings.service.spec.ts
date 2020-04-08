/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { async, TestBed } from '@angular/core/testing';
import { from, throwError } from 'rxjs';
import { ApiService } from './base-api.service';
import { SettingsService } from './settings.service';

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
        describe('settings', (): void => {
            describe('getter', (): void => {
                it('should return private mSettings', (): void => {
                    const testValue: any = {
                        test1: true,
                        test2: false,
                    };
                    (settingsService as any).mSettings = testValue;
                    expect(settingsService.settings).toEqual(testValue);
                });
            });
        });
        describe('getInitialMapZoom()', (): void => {
            interface ITestValue {
                settings?: {
                    INITIAL_LAT?: number,
                    INITIAL_LON?: number,
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
                    INITIAL_LAT: 20,
                },
            }, {
                out: {
                    lat: 0,
                    lon: 0,
                },
                settings: {
                    INITIAL_LON: 5005,
                },
            }, {
                out: {
                    lat: 49383292 / 3600000,
                    lon: 2039290 / 3600000,
                },
                settings: {
                    INITIAL_LAT: 49383292,
                    INITIAL_LON: 2039290,
                },
            }];
            testValues.forEach((testValue: ITestValue): void => {
                it('should return LatLon(' + testValue.out.lat + ',' + testValue.out.lon + ')', (): void => {
                    (settingsService as any).mSettings = testValue.settings;
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
        describe('load()', (): void => {
            describe('should resolve on error in observable', (): void => {
                beforeEach((): void => {
                    getSettingsSpy.and.returnValue(throwError(false));
                });
                it('should resolve', (done: DoneFn): void => {
                    settingsService.load()
                        .then((result: any): void => {
                            expect(getSettingsSpy.call.length).toEqual(1);
                            expect(result).toEqual(undefined);
                            expect((settingsService as any).mSettings).not.toBeDefined();
                            done();
                        })
                        .catch(done.fail);
                });
            });

            describe('should resolve on complete in observable', (): void => {
                const testValue: any = {
                    test: true,
                    test1: 2,
                };
                beforeEach((): void => {
                    getSettingsSpy.and.returnValue(from([testValue]));
                });
                it('should resolve', (done: DoneFn): void => {
                    settingsService.load()
                        .then((result: any): void => {
                            expect(getSettingsSpy.call.length).toEqual(1);
                            expect(result).toEqual(undefined);
                            expect((settingsService as any).mSettings).toEqual(testValue);
                            done();
                        })
                        .catch(done.fail);
                });
            });

        });
    });
});
