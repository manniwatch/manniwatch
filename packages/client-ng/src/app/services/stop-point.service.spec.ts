/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { async, TestBed } from '@angular/core/testing';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
import { from, EMPTY } from 'rxjs';
import { ApiService } from './api.service';
import { AppNotificationService } from './app-notification.service';
import { StopPointService } from './stop-point.service';

class TestApiService {

}
class TestAppNotificationService {

}

describe('src/app/services/stop-point.service', () => {
    describe('StopPointService', () => {
        let stopService: StopPointService;
        let nextSpy: jasmine.Spy<jasmine.Func>;
        const testLocations: IStopLocation[] = [
            {
                latitude: 1,
                longitude: 2,
                shortName: '1',
            } as any,
            {
                latitude: 2,
                longitude: 2,
                shortName: '2',
            } as any,
            {
                latitude: 3,
                longitude: 45,
                shortName: '3',
            } as any,
            undefined as any,
        ];
        beforeAll(() => {
            nextSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [StopPointService,
                    {
                        provide: ApiService,
                        useValue: new TestApiService(),
                    },
                    {
                        provide: AppNotificationService,
                        useValue: new TestAppNotificationService(),
                    }],
            });
            stopService = TestBed.get(StopPointService);
        }));

        afterEach(() => {
            nextSpy.calls.reset();
        });

        describe('loadStops()', () => {
            it('needs to implemented');
        });

        describe('stopLocations', () => {
            describe('getter', () => {
                it('should get an empty list if mStopLocations is set to undefined', () => {
                    (stopService as any).mStopLocations = undefined;
                    expect(stopService.stopLocations).toEqual([]);
                });
                it('should get an empty list if mStopLocations is a list', () => {
                    (stopService as any).mStopLocations = testLocations;
                    expect(stopService.stopLocations).toEqual(testLocations);
                });
            });
        });
        describe('getStopLocation(stopShortName)', () => {
            it('should return if the stopShortName is unknown', () => {
                (stopService as any).mStopLocations = [];
                expect(stopService.getStopLocation('1')).toBeUndefined();
            });
            it('should return the expected item', () => {
                (stopService as any).mStopLocations = testLocations;
                expect(stopService.getStopLocation('1')).toEqual(testLocations[0]);
                expect(stopService.getStopLocation('3')).toEqual(testLocations[2]);
            });
        });
        describe('searchStop(stopShortName)', () => {
            describe('no stops available', () => {
                let observableSpy: jasmine.Spy<jasmine.Func>;
                beforeEach(() => {
                    observableSpy = spyOnProperty(stopService, 'stopLocationsObservable');
                    observableSpy.and.returnValue(EMPTY);
                });
                it('should return no stop', (done) => {
                    stopService
                        .searchStop('4')
                        .subscribe(nextSpy, done, () => {
                            expect(nextSpy).toHaveBeenCalledTimes(0);
                            done();
                        });
                });
            });
            describe('a stop list was loaded', () => {
                let observableSpy: jasmine.Spy<jasmine.Func>;
                beforeEach(() => {
                    observableSpy = spyOnProperty(stopService, 'stopLocationsObservable');
                    observableSpy.and.returnValue(from([testLocations, testLocations]));
                });
                describe('no known stop is provided', () => {
                    it('should return no stop and just complete', (done) => {
                        stopService
                            .searchStop('4')
                            .subscribe(nextSpy, done, () => {
                                expect(nextSpy).toHaveBeenCalledTimes(0);
                                done();
                            });
                    });
                });
                describe('known stop is provided', () => {
                    it('should return a stop', (done) => {
                        stopService
                            .searchStop('1')
                            .subscribe(nextSpy, done, () => {
                                expect(nextSpy).toHaveBeenCalledTimes(2);
                                expect(nextSpy).toHaveBeenCalledWith(testLocations[0]);
                                done();
                            });
                    });
                });
            });

        });
        describe('stopLocationsObservable', () => {
            describe('getter', () => {
                let createObservable: jasmine.Spy<jasmine.Func>;
                beforeEach(() => {
                    createObservable = spyOn(stopService, 'createStopLoadObservable');
                    createObservable.and.returnValue(from([false]));
                });
                afterEach(() => {
                    createObservable.calls.reset();
                });
                describe('sharedReplay observable was already created', () => {
                    it('createStopLoadObservable should not be called', (done) => {
                        (stopService as any).sharedReplay = from([true]);
                        stopService.stopLocationsObservable
                            .subscribe(nextSpy, () => { }, () => {
                                expect(createObservable).toHaveBeenCalledTimes(0);
                                expect(nextSpy).toHaveBeenCalledTimes(1);
                                expect(nextSpy).toHaveBeenCalledWith(true);
                                done();
                            });
                    });
                });
                describe('sharedReplay observable was not already created', () => {
                    it('createStopLoadObservable should be called', (done) => {
                        stopService.stopLocationsObservable
                            .subscribe(nextSpy, () => { }, () => {
                                expect(createObservable).toHaveBeenCalledTimes(1);
                                expect(nextSpy).toHaveBeenCalledTimes(1);
                                expect(nextSpy).toHaveBeenCalledWith(false);
                                done();
                            });
                    });
                });
            });

        });
    });
});
