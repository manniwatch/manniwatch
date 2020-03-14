/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, DebugElement, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ITripPassages } from '@manniwatch/api-types';
import { Subject } from 'rxjs';
import { TripPassagesComponent } from './trip-passages.component';
import { TripPassagesService } from './trip-passages.service';
import { IPassageStatus, UpdateStatus } from './trip-util';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
  selector: 'app-vehicle-map-header',
  template: '<div></div>',
})
export class TestVehicleMapHeaderComponent {
  @Input()
  public tripInfo: ITripPassages;
}
@Component({
  selector: 'app-trip-passages-list',
  template: '<div></div>',
})
export class TestTripPassagesListComponent {
  @Input()
  public tripInfo: ITripPassages;
}

// tslint:enable:component-selector
// tslint:enable:directive-selector
describe('src/app/modules/trip-passages/trip-passage.component', (): void => {
  describe('TripPassagesComponent', (): void => {
    const testStatusSubject: Subject<IPassageStatus> = new Subject();
    beforeEach(async((): void => {
      TestBed.configureTestingModule({
        declarations: [
          TripPassagesComponent,
          TestTripPassagesListComponent,
          TestVehicleMapHeaderComponent,
        ],
        providers: [
          {
            provide: TripPassagesService,
            useValue: {
              statusObservable: testStatusSubject,
            },
          },
        ],
      }).overrideProvider(TripPassagesService, {
        useValue: {
          statusObservable: testStatusSubject,
        },
      }).compileComponents();
    }));
    let cmpFixture: ComponentFixture<TripPassagesComponent>;
    let cmp: TripPassagesComponent;
    beforeEach((): void => {
      cmpFixture = TestBed.createComponent(TripPassagesComponent);
      cmp = cmpFixture.componentInstance;
    });
    describe('with status set', (): void => {
      let listDebugElement: DebugElement;
      let mapHeaderDebugElement: DebugElement;
      let notFoundDebugElement: DebugElement;
      const testStatus: IPassageStatus = {
        failures: 0,
        status: UpdateStatus.LOADED,
        timestamp: Date.now(),
        tripId: 'tripId',
        tripInfo: { test: true } as any,
      };
      beforeEach((): void => {
        cmpFixture.detectChanges();
        testStatusSubject.next(testStatus);
        cmpFixture.detectChanges();
        listDebugElement = cmpFixture.debugElement
          .query(By.directive(TestTripPassagesListComponent));
        mapHeaderDebugElement = cmpFixture.debugElement
          .query(By.directive(TestVehicleMapHeaderComponent));
        notFoundDebugElement = cmpFixture.debugElement
          .query(By.css('div.not-found'));
      });
      it('should display "no passages" disclaimer', (): void => {
        expect(listDebugElement).toBeDefined();
        expect(mapHeaderDebugElement).toBeDefined();
        expect(notFoundDebugElement).toBeNull();
        const listCmp: TestTripPassagesListComponent = listDebugElement.componentInstance;
        const mapHeaderCmp: TestVehicleMapHeaderComponent = mapHeaderDebugElement.componentInstance;
        expect(listCmp.tripInfo).toEqual(testStatus.tripInfo);
        expect(mapHeaderCmp.tripInfo).toEqual(testStatus.tripInfo);
      });
    });
    describe('with no status emitted', (): void => {
      it('should display no content', (): void => {
        cmpFixture.detectChanges();
        expect(cmpFixture.debugElement.nativeElement.innerText).toEqual('');
      });
    });
  });
});
