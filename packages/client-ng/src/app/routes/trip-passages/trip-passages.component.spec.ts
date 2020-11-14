/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, DebugElement, Directive, Input } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ITripPassages, IVehicleLocation } from '@manniwatch/api-types';
import { Observable, Subject } from 'rxjs';
import { IStaticMapData } from 'src/app/modules/openlayers';
import { TripPassagesComponent } from './trip-passages.component';
import { TripPassagesService } from './trip-passages.service';
import { IPassageStatus, UpdateStatus } from './trip-util';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
  selector: 'app-trip-passages-list',
  template: '<div></div>',
})
export class TestTripPassagesListComponent {
  @Input()
  public tripInfo: ITripPassages;
}
@Component({
  selector: 'app-header-box',
  template: '<ng-content></ng-content>',
})
export class TestAppHeaderBoxComponent {
  @Input()
  public title: string;
}
@Directive({
  selector: 'map[appOlStatic]',
})
export class TestStaticMapDirective {
  @Input()
  public mapData: IStaticMapData;
}

// tslint:enable:component-selector
// tslint:enable:directive-selector
describe('src/app/routes/trip-passages/trip-passage.component', (): void => {
  describe('TripPassagesComponent', (): void => {
    const testStatusSubject: Subject<IPassageStatus> = new Subject();
    const testVehicleLocationSubject: Subject<IVehicleLocation> = new Subject();
    beforeEach(waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [
          TripPassagesComponent,
          TestTripPassagesListComponent,
          TestStaticMapDirective,
          TestAppHeaderBoxComponent,
        ],
        providers: [
          {
            provide: TripPassagesService,
            useValue: {
              createStopLocationObservable: (): Observable<IVehicleLocation> => testVehicleLocationSubject,
              statusObservable: testStatusSubject,
            },
          },
        ],
      }).overrideProvider(TripPassagesService, {
        useValue: {
          createStopLocationObservable: (): Observable<IVehicleLocation> => testVehicleLocationSubject,
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
          .query(By.directive(TestStaticMapDirective));
        notFoundDebugElement = cmpFixture.debugElement
          .query(By.css('div.not-found'));
      });
      it('should display "no passages" disclaimer', (): void => {
        expect(listDebugElement).toBeDefined();
        expect(mapHeaderDebugElement).toBeDefined();
        expect(notFoundDebugElement).toBeNull();
        const listCmp: TestTripPassagesListComponent = listDebugElement.componentInstance;
        const mapHeaderCmp: TestStaticMapDirective = mapHeaderDebugElement.componentInstance;
        expect(listCmp.tripInfo).toEqual(testStatus.tripInfo);
        expect(mapHeaderCmp.mapData).toEqual(cmp.headerMapData);
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
