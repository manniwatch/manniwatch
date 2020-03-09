import { async, TestBed } from '@angular/core/testing';
import { LatLng } from 'leaflet';
import { from, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { SettingsService } from './settings.service';
// import * as sinon from "sinon";

describe('src/app/services/settings.service', () => {
    describe('SettingsService', () => {
        let settingsService: SettingsService;
        let getSettingsSpy: jasmine.Spy<jasmine.Func>;
        beforeAll(() => {
            getSettingsSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
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
            settingsService = TestBed.get(SettingsService);
        }));

        afterEach(() => {
            getSettingsSpy.calls.reset();
        });
        describe('settings', () => {
            describe('getter', () => {
                it('should return private mSettings', () => {
                    const testValue: any = {
                        test1: true,
                        test2: false,
                    };
                    (settingsService as any).mSettings = testValue;
                    expect(settingsService.settings).toEqual(testValue);
                });
            });
        });
        describe('getInitialMapZoom()', () => {
            const testValues: {
                settings?: {
                    INITIAL_LAT?: number,
                    INITIAL_LON?: number,
                },
                out: {
                    lat: number,
                    lon: number,
                },
            }[] = [{
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
            testValues.forEach((testValue) => {
                it('should return LatLon(' + testValue.out.lat + ',' + testValue.out.lon + ')', () => {
                    (settingsService as any).mSettings = testValue.settings;
                    expect(settingsService.getInitialMapCenter()).toEqual(new LatLng(testValue.out.lat, testValue.out.lon));
                });
            });
        });
        describe('getInitialMapZoom()', () => {
            const testValues: {
                settings: boolean,
                value?: number,
            }[] = [];
            testValues.forEach((testValue) => {
                it('should return zoom level ' + (testValue.value ? testValue.value : 20), () => {
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
        describe('load()', () => {
            describe('should resolve on error in observable', () => {
                beforeEach(() => {
                    getSettingsSpy.and.returnValue(throwError(false));
                });
                it('should resolve', (done) => {
                    settingsService.load()
                        .then((result) => {
                            expect(getSettingsSpy.call.length).toEqual(1);
                            expect(result).toEqual(undefined);
                            expect((settingsService as any).mSettings).not.toBeDefined();
                            done();
                        })
                        .catch(done);
                });
            });

            describe('should resolve on complete in observable', () => {
                const testValue: any = {
                    test: true,
                    test1: 2,
                };
                beforeEach(() => {
                    getSettingsSpy.and.returnValue(from([testValue]));
                });
                it('should resolve', (done) => {
                    settingsService.load()
                        .then((result) => {
                            expect(getSettingsSpy.call.length).toEqual(1);
                            expect(result).toEqual(undefined);
                            expect((settingsService as any).mSettings).toEqual(testValue);
                            done();
                        })
                        .catch(done);
                });
            });

        });
    });
});
