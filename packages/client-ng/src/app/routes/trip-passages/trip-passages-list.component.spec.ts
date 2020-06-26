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
  VEHICLE_STATUS,
} from '@manniwatch/api-types';
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
    id: 'anyid3',
    name: 'anystop3',
    shortName: 'anyStopName3',
  },
  stop_seq_num: '3',
}, {
  actualTime: '12:20',
  status: VEHICLE_STATUS.PREDICTED,
  stop: {
    id: 'anyid1',
    name: 'anystop1',
    shortName: 'anyStopName1',
  },
  stop_seq_num: '1',
}, {
  actualTime: '15:30',
  status: VEHICLE_STATUS.PLANNED,
  stop: {
    id: 'anyid2',
    name: 'anystop2',
    shortName: 'anyStopName2',
  },
  stop_seq_num: '2',
}];
const testOldPassages: IDepartedTripPassage[] = [{
  actualTime: '15:30',
  status: VEHICLE_STATUS.DEPARTED,
  stop: {
    id: 'anyid11',
    name: 'anystop11',
    shortName: 'anyStopName11',
  },
  stop_seq_num: '11',
}, {
  actualTime: '12:20',
  status: VEHICLE_STATUS.DEPARTED,
  stop: {
    id: 'anyid4',
    name: 'anystop4',
    shortName: 'anyStopName4',
  },
  stop_seq_num: '4',
}, {
  actualTime: '09:30',
  status: VEHICLE_STATUS.DEPARTED,
  stop: {
    id: 'anyid6',
    name: 'anystop6',
    shortName: 'anyStopName6',
  },
  stop_seq_num: '6',
}];
describe('src/app/routes/trip-passages/trip-passages-list.component', (): void => {
  describe('TripPassagesListComponent', (): void => {
    beforeEach(async((): void => {
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
    describe('properties', (): void => {
      let cmpFixture: ComponentFixture<TripPassagesListComponent>;
      let cmp: TripPassagesListComponent;
      beforeEach((): void => {
        cmpFixture = TestBed.createComponent(TripPassagesListComponent);
        cmp = cmpFixture.componentInstance;
      });
      describe('set - tripInfo', (): void => {
        it('should set passages to an empty array for null', (): void => {
          // tslint:disable-next-line:no-null-keyword
          cmp.tripInfo = null;
          expect(cmp.passages).toEqual([]);
        });
        it('should set passages to an empty array for undefined', (): void => {
          cmp.tripInfo = undefined;
          expect(cmp.passages).toEqual([]);
        });
        it('should set passages to an empty array with no actual and old provided', (): void => {
          cmp.tripInfo = {} as TripInfoWithId;
          expect(cmp.passages).toEqual([]);
        });
        it('should set passages ordered correctly for actual and old provided', (): void => {
          cmp.tripInfo = {
            actual: testActualPassages,
            directionText: 'direction1',
            old: testOldPassages,
            routeName: 'routeName1',
            tripId: 'testId',
          };
          expect(cmp.passages).toEqual([testActualPassages[1],
          testActualPassages[2],
          testActualPassages[0],
          testOldPassages[1],
          testOldPassages[2],
          testOldPassages[0]]);
        });
        it('should set passages ordered correctly with only old provided', (): void => {
          cmp.tripInfo = {
            actual: undefined,
            directionText: 'direction1',
            old: testOldPassages,
            routeName: 'routeName1',
            tripId: 'testId',
          };
          expect(cmp.passages).toEqual([testOldPassages[1],
          testOldPassages[2],
          testOldPassages[0]]);
        });
        it('should set passages ordered correctly with only actual provided', (): void => {
          cmp.tripInfo = {
            actual: testActualPassages,
            directionText: 'direction1',
            old: undefined,
            routeName: 'routeName1',
            tripId: 'testId',
          };
          expect(cmp.passages).toEqual([testActualPassages[1],
          testActualPassages[2],
          testActualPassages[0]]);
        });
      });
    });
    describe('methods', (): void => {
      let cmpFixture: ComponentFixture<TripPassagesListComponent>;
      let cmp: TripPassagesListComponent;
      beforeEach((): void => {
        cmpFixture = TestBed.createComponent(TripPassagesListComponent);
        cmp = cmpFixture.componentInstance;
      });
      describe('hasPassages()', (): void => {
        // tslint:disable-next-line:no-null-keyword
        [undefined, null, [], 1, 'k'].forEach((testValue: any): void => {
          it('should return false for passages being "' + testValue + '"', (): void => {
            cmp.passages = testValue;
            expect(cmp.hasPassages()).toBeFalse();
          });
        });
        [[1], [1, 2]].forEach((testValue: any[]): void => {
          it('should return true for ' + testValue.length + ' set passages', (): void => {
            cmp.passages = testValue;
            expect(cmp.hasPassages()).toBeTrue();
          });
        });
      });
    });
    describe('without parent element', (): void => {
      let cmpFixture: ComponentFixture<TripPassagesListComponent>;
      let cmp: TripPassagesListComponent;
      beforeEach((): void => {
        cmpFixture = TestBed.createComponent(TripPassagesListComponent);
        cmp = cmpFixture.componentInstance;
      });
      describe('with passages set', (): void => {
        let listItems: TestTripPassagesListItemComponent[];
        let bodyText: string;
        [1, 2, 3].forEach((testNum: number): void => {

          it('should display ' + testNum + ' all relavent items', (): void => {
            cmp.passages = testActualPassages.slice(0, testNum);
            cmpFixture.detectChanges();
            listItems = cmpFixture.debugElement
              .queryAll(By.directive(TestTripPassagesListItemComponent))
              .map((val: DebugElement): TestTripPassagesListItemComponent => val.componentInstance);
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
      describe('without passages set', (): void => {
        let listItems: TestTripPassagesListItemComponent[];
        let bodyText: string;
        [undefined, []].forEach((testItem: any): void => {

          it('should display "no passages" disclaimer', (): void => {
            cmp.passages = testItem;
            cmpFixture.detectChanges();
            listItems = cmpFixture.debugElement
              .queryAll(By.directive(TestTripPassagesListItemComponent))
              .map((val: DebugElement): TestTripPassagesListItemComponent => val.componentInstance);
            bodyText = cmpFixture.debugElement.nativeElement.innerText;
            expect(bodyText).toEqual('No Passages');
            expect(listItems.length).toEqual(0);
          });
        });
      });
    });
    describe('with parent element', (): void => {
      let parentFixture: ComponentFixture<TestParentComponent>;
      let parentCmp: TestParentComponent;
      let cmp: TripPassagesListComponent;
      let tripInfoSpy: jasmine.Spy<jasmine.Func>;
      beforeEach((): void => {
        parentFixture = TestBed.createComponent(TestParentComponent);
        parentCmp = parentFixture.componentInstance;
        cmp = parentFixture.debugElement.query(By.directive(TripPassagesListComponent)).componentInstance;
        tripInfoSpy = spyOnProperty(cmp, 'tripInfo', 'set');
        tripInfoSpy.and.callFake((): void => {
        });
        parentCmp.testPassage = undefined;
        parentFixture.detectChanges();
      });
      it('should set the elements via the Input tag', (): void => {
        expect(tripInfoSpy).toHaveBeenCalledTimes(1);
        expect(tripInfoSpy).toHaveBeenCalledWith(undefined);
        parentCmp.testPassage = testActualPassages as any;
        parentFixture.detectChanges();
        expect(tripInfoSpy).toHaveBeenCalledTimes(2);
        expect(tripInfoSpy).toHaveBeenCalledWith(testActualPassages);
      });
      afterEach((): void => {
        tripInfoSpy.calls.reset();
      });
    });
  });
});
