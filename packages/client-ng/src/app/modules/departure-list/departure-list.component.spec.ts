/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, Input } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IDeparture } from '@manniwatch/api-types';
import { DepartureListComponent } from './departure-list.component';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
  selector: 'mat-nav-list',
  template: '<div></div>',
})
export class TestMatNavListComponent {
}
@Component({
  selector: 'app-departure-list-item',
  template: '<div></div>',
})
export class TestDepartureListItemComponent {
  @Input()
  public departure: IDeparture;
}

// tslint:enable:component-selector
// tslint:enable:directive-selector
describe('src/app/modules/stop/departure-list.component', (): void => {
  describe('DepartureListComponent', (): void => {
    beforeEach(waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [
          DepartureListComponent,
          TestMatNavListComponent,
          TestDepartureListItemComponent,
        ],
      }).compileComponents();
    }));
    it('should create the app', waitForAsync((): void => {
      const fixture: ComponentFixture<DepartureListComponent> = TestBed.createComponent(DepartureListComponent);
      const app: DepartureListComponent = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    }));
    describe('layout', (): void => {
      it('needs to be implemented');
    });
    describe('Component methods and attributes', (): void => {
      let fixture: ComponentFixture<DepartureListComponent>;
      let cmp: DepartureListComponent;
      beforeEach((): void => {
        fixture = TestBed.createComponent(DepartureListComponent);
        cmp = fixture.debugElement.componentInstance;
      });
      interface ITestDepartures { value: IDeparture[]; result: IDeparture[]; }
      const testPassages: ITestDepartures[] = [
        {
          result: [],
          value: undefined,
        }, {
          result: [],
          value: [],
        }, {
          result: [1, 2] as any,
          value: [1, 2] as any,
        },
      ];
      describe('departures', (): void => {
        describe('getter', (): void => {
          testPassages.forEach((testPassage: ITestDepartures): void => {
            it('should get the correct value for "' + testPassage.value + '"', (): void => {
              (cmp as any).mDepartures = testPassage.value;
              expect(cmp.departures).toEqual(testPassage.result);
            });
          });
        });
        describe('setter', (): void => {
          testPassages.forEach((testPassage: ITestDepartures): void => {
            it('should set the correct value for "' + testPassage.value + '"', (): void => {
              cmp.departures = testPassage.value;
              expect((cmp as any).mDepartures).toEqual(testPassage.result);
            });
          });
        });
      });
      describe('hasDepartures()', (): void => {
        const data: { value: any, result: boolean }[] = [{
          result: false,
          value: undefined,
        }, {
          result: false,
          value: [],
        }, {
          result: true,
          value: [1],
        }, {
          result: true,
          value: [1, 2],
        }];
        data.forEach((testData: { value: any, result: boolean }): void => {
          it('should return "' + testData.result + '" for ' + JSON.stringify(testData.value), (): void => {
            (cmp as any).mDepartures = testData.value;
            expect(cmp.hasDepartures()).toEqual(testData.result);
          });
        });
      });
    });
  });
});
