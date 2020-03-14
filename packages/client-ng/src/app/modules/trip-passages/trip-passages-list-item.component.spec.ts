/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { ChangeDetectionStrategy, Component, Directive, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ITripPassage } from '@manniwatch/api-types';
import { VEHICLE_STATUS } from '@manniwatch/api-types/dist/vehicle-status';
import { TripPassagesListItemComponent } from './trip-passages-list-item.component';
// tslint:disable:max-classes-per-file
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
}, {
  actualTime: '09:30',
  status: VEHICLE_STATUS.STOPPING,
  stop: {
    id: 'anyid3',
    name: 'anystop3',
    shortName: 'anyStopName3',
  },
  stop_seq_num: '3',
}];
describe('src/app/modules/trip-passages/trip-passages-list-item.component', (): void => {
  describe('TripPassagesListItemComponent', (): void => {
    beforeEach(async((): void => {
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
    describe('properties', (): void => {
      let cmpFixture: ComponentFixture<TripPassagesListItemComponent>;
      let cmp: TripPassagesListItemComponent;
      beforeEach((): void => {
        cmpFixture = TestBed.createComponent(TripPassagesListItemComponent);
        cmp = cmpFixture.componentInstance;
      });
      describe('departed', (): void => {
        // tslint:disable-next-line:no-null-keyword
        [null, undefined, { status: VEHICLE_STATUS.STOPPING }]
          .forEach((testValue: any): void => {
            it('should return false for :' + JSON.stringify(testValue), (): void => {
              cmp.passage = testValue;
              expect(cmp.departed).toBeFalse();
            });
          });
        it('should return true for status being DEPARTED ', (): void => {
          cmp.passage = { status: VEHICLE_STATUS.DEPARTED } as ITripPassage;
          expect(cmp.departed).toBeTrue();
        });
      });
      describe('stopping', (): void => {
        // tslint:disable-next-line:no-null-keyword
        [null, undefined, { status: VEHICLE_STATUS.DEPARTED }]
          .forEach((testValue: any): void => {
            it('should return false for :' + JSON.stringify(testValue), (): void => {
              cmp.passage = testValue;
              expect(cmp.stopping).toBeFalse();
            });
          });
        it('should return true for status being STOPPING', (): void => {
          cmp.passage = { status: VEHICLE_STATUS.STOPPING } as ITripPassage;
          expect(cmp.stopping).toBeTrue();
        });
      });
    });
    describe('without parent element', (): void => {
      let cmpFixture: ComponentFixture<TripPassagesListItemComponent>;
      let cmp: TripPassagesListItemComponent;
      let routerLinkCmp: TestRouterLinkDirective;
      beforeEach((): void => {
        cmpFixture = TestBed.createComponent(TripPassagesListItemComponent);
        cmp = cmpFixture.componentInstance;
        routerLinkCmp = cmpFixture.debugElement
          .query(By.directive(TestRouterLinkDirective))
          .injector.get(TestRouterLinkDirective);
      });
      testPassages.forEach((testPassage: ITripPassage): void => {
        it('layout should be updated with correct values with passage seq_num "' + testPassage.stop_seq_num + '"', (): void => {
          cmp.passage = testPassage;
          cmpFixture.detectChanges();
          const titleElement: HTMLElement = cmpFixture.debugElement.query(By.css('h3')).nativeElement;
          expect(titleElement.innerText).toEqual(testPassage.stop.name);
          expect(routerLinkCmp.routerLink).toEqual(['/stop', testPassage.stop.shortName]);
        });
      });
    });
    describe('with parent element', (): void => {
      let parentFixture: ComponentFixture<TestParentComponent>;
      let cmp: TripPassagesListItemComponent;
      let parentCmp: TestParentComponent;
      beforeEach((): void => {
        parentFixture = TestBed.createComponent(TestParentComponent);
        parentCmp = parentFixture.componentInstance;
        cmp = parentFixture.debugElement.query(By.directive(TripPassagesListItemComponent)).componentInstance;
      });
      testPassages.forEach((testPassage: ITripPassage): void => {
        it('layout should be updated with correct values with passage seq_num "' + testPassage.stop_seq_num + '"', (): void => {
          parentCmp.testPassage = testPassage;
          parentFixture.detectChanges();
          expect(cmp.passage).toEqual(testPassage);
        });
      });
    });
  });
});
