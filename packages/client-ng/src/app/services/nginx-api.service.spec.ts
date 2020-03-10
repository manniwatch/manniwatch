import { HttpClient } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { from, Observable } from 'rxjs';
import { NginxApiService } from './nginx-api.service';

const handleResult: <T>(obs: Observable<T>, doneCb: DoneFn, expectedResponse: any) => void
    = <T>(obs: Observable<T>, doneCb: DoneFn, expectedResponse: any): void => {
        const resultSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('resultSpy');
        obs.subscribe({
            complete: (): void => {
                expect(resultSpy).toHaveBeenCalledTimes(1);
                expect(resultSpy).toHaveBeenCalledWith(expectedResponse);
                doneCb();
            },
            error: doneCb,
            next: resultSpy,
        });
    };

describe('src/app/services/nginx-api.service', () => {
    describe('NginxApiService', () => {
        let apiService: NginxApiService;
        let getSpy: jasmine.Spy<jasmine.Func>;
        const testEndpoint: string = 'https://test.com/';
        const testId: any = 'testId1234';
        beforeAll(() => {
            getSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            getSpy.and.callFake((...args: any[]): Observable<any> =>
                from([args]));
            TestBed.configureTestingModule({
                providers: [NginxApiService,
                    {
                        provide: HttpClient,
                        useValue: {
                            get: getSpy,
                        },
                    }],
            });
            apiService = TestBed.get(NginxApiService);
            spyOn(apiService, 'baseUrl').and.returnValue(testEndpoint);
        }));

        afterEach(() => {
            getSpy.calls.reset();
        });

        describe('getTripPassages(tripId)', () => {
            it('should construct the request correctly', (done: DoneFn) => {
                handleResult(apiService.getTripPassages(testId),
                    done,
                    { 0: testEndpoint + 'trip/' + testId + '/passages?mode=departure', tripId: testId });
            });
        });
        describe('getRouteByVehicleId(vehicleId)', () => {
            it('should construct the request correctly', (done: DoneFn) => {
                handleResult(apiService.getRouteByVehicleId(testId),
                    done,
                    [testEndpoint + 'vehicle/' + testId + '/route']);
            });
        });
        describe('getRouteByTripId(vehicleId)', () => {
            it('should construct the request correctly', (done: DoneFn) => {
                handleResult(apiService.getRouteByTripId(testId),
                    done,
                    [testEndpoint + 'trip/' + testId + '/route']);
            });
        });
        describe('getStopInfo(vehicleId)', () => {
            it('should construct the request correctly', (done: DoneFn) => {
                handleResult(apiService.getStopInfo(testId),
                    done,
                    [testEndpoint + 'stop/' + testId + '/info']);
            });
        });
        describe('getStopDepartures(vehicleId)', () => {
            it('should construct the request correctly', (done: DoneFn) => {
                handleResult(apiService.getStopPassages(testId),
                    done,
                    [testEndpoint + 'stop/' + testId + '/passages']);
            });
        });
        describe('getStopLocations()', () => {
            it('should construct the request correctly', (done: DoneFn) => {
                handleResult(apiService.getStopLocations(),
                    done,
                    [testEndpoint + 'geo/stops?left=-648000000&bottom=-324000000&right=648000000&top=324000000']);
            });
        });
        describe('getStopPointLocations()', () => {
            it('should construct the request correctly', (done: DoneFn) => {
                handleResult(apiService.getStopPointLocations(),
                    done,
                    [testEndpoint + 'geo/stopPoints?left=-648000000&bottom=-324000000&right=648000000&top=324000000']);
            });
        });
    });
});
