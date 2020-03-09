/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { ChangeDetectionStrategy, Component, DebugElement, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  IActualTripPassage,
  IDepartedTripPassage,
  ITripPassage,
  ITripPassages,
  StopId,
  StopShortName,
  TripId,
} from '@manniwatch/api-types';
import { VEHICLE_STATUS } from '@manniwatch/api-types/dist/vehicle-status';
import { TripInfoWithId } from 'src/app/services';
import { TripPassagesListComponent } from './trip-passages-list.component';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
  selector: 'mat-nav-list',
  template: '<ng-content></ng-content>',
})
export class TestMatNavListComponent {
}
@Component({
  selector: 'app-trip-passages-list-item',
  template: '<p>list-item</p>',
})
export class TestTripPassagesListItemComponent {
  @Input()
  public passage: ITripPassage;
}

@Component({
  template: '<app-trip-passages-list [tripInfo]="testPassage"></app-trip-passages-list>',
})
export class TestParentComponent {
  public testPassage: ITripPassages;
}
// tslint:enable:component-selector
// tslint:enable:directive-selector
const testActualPassages: IActualTripPassage[] = [{
  actualTime: '09:30',
  status: VEHICLE_STATUS.STOPPING,
  stop: {
    id: 'anyid3' as StopId,
    name: 'anystop3',
    shortName: 'anyStopName3' as StopShortName,
  },
  stop_seq_num: '3',
}, {
  actualTime: '12:20',
  status: VEHICLE_STATUS.PREDICTED,
  stop: {
    id: 'anyid1' as StopId,
    name: 'anystop1',
    shortName: 'anyStopName1' as StopShortName,
  },
  stop_seq_num: '1',
}, {
  actualTime: '15:30',
  status: VEHICLE_STATUS.PLANNED,
  stop: {
    id: 'anyid2' as StopId,
    name: 'anystop2',
    shortName: 'anyStopName2' as StopShortName,
  },
  stop_seq_num: '2',
}];
const testOldPassages: IDepartedTripPassage[] = [{
  actualTime: '15:30',
  status: VEHICLE_STATUS.DEPARTED,
  stop: {
    id: 'anyid11' as StopId,
    name: 'anystop11',
    shortName: 'anyStopName11' as StopShortName,
  },
  stop_seq_num: '11',
}, {
  actualTime: '12:20',
  status: VEHICLE_STATUS.DEPARTED,
  stop: {
    id: 'anyid4' as StopId,
    name: 'anystop4',
    shortName: 'anyStopName4' as StopShortName,
  },
  stop_seq_num: '4',
}, {
  actualTime: '09:30',
  status: VEHICLE_STATUS.DEPARTED,
  stop: {
    id: 'anyid6' as StopId,
    name: 'anystop6',
    shortName: 'anyStopName6' as StopShortName,
  },
  stop_seq_num: '6',
}];
describe('src/app/modules/trip-passages/trip-passages-list.component', () => {
  describe('TripPassagesListComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          TripPassagesListComponent,
          TestMatNavListComponent,
          TestTripPassagesListItemComponent,
          TestParentComponent,
        ],
      }).overrideComponent(TripPassagesListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      }).compileComponents();
    }));
    describe('properties', () => {
      let cmpFixture: ComponentFixture<TripPassagesListComponent>;
      let cmp: TripPassagesListComponent;
      beforeEach(() => {
        cmpFixture = TestBed.createComponent(TripPassagesListComponent);
        cmp = cmpFixture.componentInstance;
      });
      describe('set - tripInfo', () => {
        it('should set passages to an empty array for null', () => {
          // tslint:disable-next-line:no-null-keyword
          cmp.tripInfo = null;
          expect(cmp.passages).toEqual([]);
        });
        it('should set passages to an empty array for undefined', () => {
          cmp.tripInfo = undefined;
          expect(cmp.passages).toEqual([]);
        });
        it('should set passages to an empty array with no actual and old provided', () => {
          cmp.tripInfo = {} as TripInfoWithId;
          expect(cmp.passages).toEqual([]);
        });
        it('should set passages ordered correctly for actual and old provided', () => {
          cmp.tripInfo = {
            actual: testActualPassages,
            directionText: 'direction1',
            old: testOldPassages,
            routeName: 'routeName1',
            tripId: 'testId' as TripId,
          };
          expect(cmp.passages).toEqual([testActualPassages[1],
          testActualPassages[2],
          testActualPassages[0],
          testOldPassages[1],
          testOldPassages[2],
          testOldPassages[0]]);
        });
        it('should set passages ordered correctly with only old provided', () => {
          cmp.tripInfo = {
            actual: undefined,
            directionText: 'direction1',
            old: testOldPassages,
            routeName: 'routeName1',
            tripId: 'testId' as TripId,
          };
          expect(cmp.passages).toEqual([testOldPassages[1],
          testOldPassages[2],
          testOldPassages[0]]);
        });
        it('should set passages ordered correctly with only actual provided', () => {
          cmp.tripInfo = {
            actual: testActualPassages,
            directionText: 'direction1',
            old: undefined,
            routeName: 'routeName1',
            tripId: 'testId' as TripId,
          };
          expect(cmp.passages).toEqual([testActualPassages[1],
          testActualPassages[2],
          testActualPassages[0]]);
        });
      });
    });
    describe('methods', () => {
      let cmpFixture: ComponentFixture<TripPassagesListComponent>;
      let cmp: TripPassagesListComponent;
      beforeEach(() => {
        cmpFixture = TestBed.createComponent(TripPassagesListComponent);
        cmp = cmpFixture.componentInstance;
      });
      describe('hasPassages()', () => {
        // tslint:disable-next-line:no-null-keyword
        [undefined, null, [], 1, 'k'].forEach((testValue: any) => {
          it('should return false for passages being "' + testValue + '"', () => {
            cmp.passages = testValue;
            expect(cmp.hasPassages()).toBeFalse();
          });
        });
        [[1], [1, 2]].forEach((testValue: any[]) => {
          it('should return true for ' + testValue.length + ' set passages', () => {
            cmp.passages = testValue;
            expect(cmp.hasPassages()).toBeTrue();
          });
        });
      });
    });
    describe('without parent element', () => {
      let cmpFixture: ComponentFixture<TripPassagesListComponent>;
      let cmp: TripPassagesListComponent;
      beforeEach(() => {
        cmpFixture = TestBed.createComponent(TripPassagesListComponent);
        cmp = cmpFixture.componentInstance;
      });
      describe('with passages set', () => {
        let listItems: TestTripPassagesListItemComponent[];
        let bodyText: string;
        [1, 2, 3].forEach((testNum: number): void => {

          it('should display ' + testNum + ' all relavent items', () => {
            cmp.passages = testActualPassages.slice(0, testNum);
            cmpFixture.detectChanges();
            listItems = cmpFixture.debugElement
              .queryAll(By.directive(TestTripPassagesListItemComponent))
              .map((val: DebugElement) => val.componentInstance);
            bodyText = cmpFixture.debugElement.nativeElement.innerText;
            expect(bodyText).not.toEqual('No Passages');
            expect(listItems.length).toEqual(testNum);
            const mappedValues: ITripPassage[] = listItems
              .map((itemCmp: TestTripPassagesListItemComponent): ITripPassage =>
                itemCmp.passage);
            expect(mappedValues).toEqual(testActualPassages.slice(0, testNum));

          });
        });
      });
      describe('without passages set', () => {
        let listItems: TestTripPassagesListItemComponent[];
        let bodyText: string;
        [undefined, []].forEach((testItem: any): void => {

          it('should display "no passages" disclaimer', () => {
            cmp.passages = testItem;
            cmpFixture.detectChanges();
            listItems = cmpFixture.debugElement
              .queryAll(By.directive(TestTripPassagesListItemComponent))
              .map((val: DebugElement) => val.componentInstance);
            bodyText = cmpFixture.debugElement.nativeElement.innerText;
            expect(bodyText).toEqual('No Passages');
            expect(listItems.length).toEqual(0);
          });
        });
      });
    });
    describe('with parent element', () => {
      let parentFixture: ComponentFixture<TestParentComponent>;
      let parentCmp: TestParentComponent;
      let cmp: TripPassagesListComponent;
      let tripInfoSpy: jasmine.Spy<jasmine.Func>;
      beforeEach(() => {
        parentFixture = TestBed.createComponent(TestParentComponent);
        parentCmp = parentFixture.componentInstance;
        cmp = parentFixture.debugElement.query(By.directive(TripPassagesListComponent)).componentInstance;
        tripInfoSpy = spyOnProperty(cmp, 'tripInfo', 'set');
        tripInfoSpy.and.callFake(() => {
        });
        parentCmp.testPassage = undefined;
        parentFixture.detectChanges();
      });
      it('should set the elements via the Input tag', () => {
        expect(tripInfoSpy).toHaveBeenCalledTimes(1);
        expect(tripInfoSpy).toHaveBeenCalledWith(undefined);
        parentCmp.testPassage = testActualPassages as any;
        parentFixture.detectChanges();
        expect(tripInfoSpy).toHaveBeenCalledTimes(2);
        expect(tripInfoSpy).toHaveBeenCalledWith(testActualPassages);
      });
      afterEach(() => {
        tripInfoSpy.calls.reset();
      });
    });
  });
});
