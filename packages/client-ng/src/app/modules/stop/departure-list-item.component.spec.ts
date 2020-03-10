/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, Directive, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartureListItemComponent } from './departure-list-item.component';

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
  selector: 'a[routerLink]',
})
export class TestRouterLinkDirective {
  @Input()
  public routerLink: string;
}

// tslint:enable:component-selector
// tslint:enable:directive-selector
describe('src/app/modules/stop/departure-list-item.component', () => {
  describe('DepartureListItemComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          DepartureListItemComponent,
          TestMatIconComponent,
          TestMatListItemComponent,
          TestRouterLinkDirective,
        ],
      }).compileComponents();
    }));
    it('should create the app', async(() => {
      const fixture: ComponentFixture<DepartureListItemComponent> = TestBed.createComponent(DepartureListItemComponent);
      const app: DepartureListItemComponent = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    }));
    describe('layout', () => {
      it('needs to be implemented');
    });
    describe('Component methods and attributes', () => {
      let fixture: ComponentFixture<DepartureListItemComponent>;
      let cmp: DepartureListItemComponent;
      beforeEach(() => {
        fixture = TestBed.createComponent(DepartureListItemComponent);
        cmp = fixture.debugElement.componentInstance;
      });
      const testPassages: any[] = [
        [{ test: true }], [{ test: false }],
      ];
      describe('departure', () => {
        describe('getter', () => {
          testPassages.forEach((testPassage: any) => {
            it('should get the correct value', () => {
              (cmp as any).mDeparture = testPassage;
              expect(cmp.departure).toEqual(testPassage);
            });
          });
        });
        describe('setter', () => {
          let calculateDelaySpy: jasmine.Spy<jasmine.Func>;
          let convertTimeSpy: jasmine.Spy<jasmine.Func>;
          beforeEach(() => {
            calculateDelaySpy = spyOn(cmp, 'calculateDelay');
            convertTimeSpy = spyOn(cmp, 'convertTime');
            calculateDelaySpy.and.callFake((arg: any) =>
              ({ delay: arg }));
            convertTimeSpy.and.callFake((arg: any) =>
              ({ time: arg }));
          });
          testPassages.forEach((testPassage: any) => {
            it('should set the correct value', () => {
              cmp.departure = testPassage;
              expect((cmp as any).mDeparture).toEqual(testPassage);
              expect(calculateDelaySpy).toHaveBeenCalledTimes(1);
              expect(convertTimeSpy).toHaveBeenCalledTimes(1);
              expect(calculateDelaySpy).toHaveBeenCalledWith(testPassage);
              expect(convertTimeSpy).toHaveBeenCalledWith(testPassage);
              expect((cmp as any).mTime).toEqual({ time: testPassage });
              expect((cmp as any).mDelay).toEqual({ delay: testPassage });
            });
          });
          afterEach(() => {
            calculateDelaySpy.calls.reset();
            convertTimeSpy.calls.reset();
          });
        });
      });
      describe('time', () => {
        describe('getter', () => {
          testPassages.forEach((value: any) => {
            it('should convert the object to "' + value + '\'', () => {
              (cmp as any).mTime = value;
              expect(cmp.time).toEqual(value);
            });
          });
        });
      });
      describe('delay', () => {
        describe('getter', () => {
          testPassages.forEach((value: any) => {
            it('should convert the object to "' + value + '\'', () => {
              (cmp as any).mDelay = value;
              expect(cmp.delay).toEqual(value);
            });
          });
        });
      });
      describe('convertTime(departure)', () => {
        const passages: {
          actualRelativeTime: number,
          actualTime: string,
          result: string,
        }[] = [
            {
              actualRelativeTime: 500,
              actualTime: '12:20',
              result: '12:20',
            },
            {
              actualRelativeTime: 300,
              actualTime: '13:20',
              result: '5min',
            },
            {
              actualRelativeTime: 20,
              actualTime: '14:20',
              result: '1min',
            },
          ];
        passages.forEach((value: any) => {
          it('should convert the object to "' + value.result + '\'', () => {
            const testValue: any = {
              actualRelativeTime: value.actualRelativeTime,
              actualTime: value.actualTime,
            };
            expect(cmp.convertTime(testValue)).toEqual(value.result);
          });
        });
      });
      describe('calculateDelay(departure)', () => {
        const passages: {
          value: {
            actualTime: string
            plannedTime: string,
          },
          result: false | number,
        }[] = [
            {
              result: +3,
              value: {
                actualTime: '13:01',
                plannedTime: '12:58',
              },
            },
            {
              result: -3,
              value: {
                actualTime: '12:58',
                plannedTime: '13:01',
              },
            },
            {
              result: false,
              value: {
                actualTime: '13:05',
                plannedTime: '13:05',
              },
            },
            {
              result: -6,
              value: {
                actualTime: '23:55',
                plannedTime: '00:01',
              },
            },
            {
              result: +6,
              value: {
                actualTime: '00:01',
                plannedTime: '23:55',
              },
            },
          ];
        passages.forEach((value: any) => {
          it('should convert the "' + value.value + '" to "' + value.result + '\'', () => {
            expect(cmp.calculateDelay(value.value as any)).toEqual(value.result);
          });
        });
      });
    });
  });
});
