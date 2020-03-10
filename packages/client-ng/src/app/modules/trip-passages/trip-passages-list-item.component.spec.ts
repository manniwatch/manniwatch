/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { ChangeDetectionStrategy, Component, Directive, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ITripPassage, StopId, StopShortName } from '@donmahallem/trapeze-api-types';
import { VEHICLE_STATUS } from '@donmahallem/trapeze-api-types/dist/vehicle-status';
import { TripPassagesListItemComponent } from './trip-passages-list-item.component';
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
  selector: 'mat-icon',
  template: '<ng-content></ng-content>',
})
export class TestMatIconComponent {
}
@Component({
  selector: 'a[mat-list-item]',
  template: '<ng-content></ng-content>',
})
export class TestMatListItemComponent {
}

@Directive({
  selector: 'a[role="listitem"]',
})
export class TestRouterLinkDirective {
  @Input()
  public routerLink: any[];
}
@Component({
  template: '<app-trip-passages-list-item [passage]="testPassage"></app-trip-passages-list-item>',
})
export class TestParentComponent {
  public testPassage: ITripPassage;
}

// tslint:enable:component-selector
// tslint:enable:directive-selector

const testPassages: ITripPassage[] = [{
  actualTime: '12:20',
  status: VEHICLE_STATUS.DEPARTED,
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
}, {
  actualTime: '09:30',
  status: VEHICLE_STATUS.STOPPING,
  stop: {
    id: 'anyid3' as StopId,
    name: 'anystop3',
    shortName: 'anyStopName3' as StopShortName,
  },
  stop_seq_num: '3',
}];
describe('src/app/modules/trip-passages/trip-passages-list-item.component', () => {
  describe('TripPassagesListItemComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          TripPassagesListItemComponent,
          TestRouterLinkDirective,
          TestMatListItemComponent,
          TestMatIconComponent,
          TestParentComponent,
        ],
      }).overrideComponent(TripPassagesListItemComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      }).compileComponents();
    }));
    describe('properties', () => {
      let cmpFixture: ComponentFixture<TripPassagesListItemComponent>;
      let cmp: TripPassagesListItemComponent;
      beforeEach(() => {
        cmpFixture = TestBed.createComponent(TripPassagesListItemComponent);
        cmp = cmpFixture.componentInstance;
      });
      describe('departed', () => {
        // tslint:disable-next-line:no-null-keyword
        [null, undefined, { status: VEHICLE_STATUS.STOPPING }]
          .forEach((testValue: any) => {
            it('should return false for :' + JSON.stringify(testValue), () => {
              cmp.passage = testValue;
              expect(cmp.departed).toBeFalse();
            });
          });
        it('should return true for status being DEPARTED ', () => {
          cmp.passage = { status: VEHICLE_STATUS.DEPARTED } as ITripPassage;
          expect(cmp.departed).toBeTrue();
        });
      });
      describe('stopping', () => {
        // tslint:disable-next-line:no-null-keyword
        [null, undefined, { status: VEHICLE_STATUS.DEPARTED }]
          .forEach((testValue: any) => {
            it('should return false for :' + JSON.stringify(testValue), () => {
              cmp.passage = testValue;
              expect(cmp.stopping).toBeFalse();
            });
          });
        it('should return true for status being STOPPING', () => {
          cmp.passage = { status: VEHICLE_STATUS.STOPPING } as ITripPassage;
          expect(cmp.stopping).toBeTrue();
        });
      });
    });
    describe('without parent element', () => {
      let cmpFixture: ComponentFixture<TripPassagesListItemComponent>;
      let cmp: TripPassagesListItemComponent;
      let routerLinkCmp: TestRouterLinkDirective;
      beforeEach(() => {
        cmpFixture = TestBed.createComponent(TripPassagesListItemComponent);
        cmp = cmpFixture.componentInstance;
        routerLinkCmp = cmpFixture.debugElement
          .query(By.directive(TestRouterLinkDirective))
          .injector.get(TestRouterLinkDirective);
      });
      testPassages.forEach((testPassage: ITripPassage): void => {
        it('layout should be updated with correct values with passage seq_num "' + testPassage.stop_seq_num + '"', () => {
          cmp.passage = testPassage;
          cmpFixture.detectChanges();
          const titleElement: HTMLElement = cmpFixture.debugElement.query(By.css('h3')).nativeElement;
          expect(titleElement.innerText).toEqual(testPassage.stop.name);
          expect(routerLinkCmp.routerLink).toEqual(['/stop', testPassage.stop.shortName]);
        });
      });
    });
    describe('with parent element', () => {
      let parentFixture: ComponentFixture<TestParentComponent>;
      let cmp: TripPassagesListItemComponent;
      let parentCmp: TestParentComponent;
      beforeEach(() => {
        parentFixture = TestBed.createComponent(TestParentComponent);
        parentCmp = parentFixture.componentInstance;
        cmp = parentFixture.debugElement.query(By.directive(TripPassagesListItemComponent)).componentInstance;
      });
      testPassages.forEach((testPassage: ITripPassage): void => {
        it('layout should be updated with correct values with passage seq_num "' + testPassage.stop_seq_num + '"', () => {
          parentCmp.testPassage = testPassage;
          parentFixture.detectChanges();
          expect(cmp.passage).toEqual(testPassage);
        });
      });
    });
  });
});
