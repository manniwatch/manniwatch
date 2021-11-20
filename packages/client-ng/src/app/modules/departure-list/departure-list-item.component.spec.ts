/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { Component, Directive, Input } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import * as dateFns from 'date-fns';
import { DepartureListItemComponent } from './departure-list-item.component';

/* eslint-disable max-classes-per-file */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/directive-selector */
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

/* eslint-enable @angular-eslint/component-selector */
/* eslint-enable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
describe('src/app/modules/stop/departure-list-item.component', (): void => {
  describe('DepartureListItemComponent', (): void => {
    beforeEach(waitForAsync((): void => {
      TestBed.configureTestingModule({
        declarations: [
          DepartureListItemComponent,
          TestMatIconComponent,
          TestMatListItemComponent,
          TestRouterLinkDirective,
        ],
      }).compileComponents();
    }));
    it('should create the app', waitForAsync((): void => {
      const fixture: ComponentFixture<DepartureListItemComponent> = TestBed.createComponent(DepartureListItemComponent);
      const app: DepartureListItemComponent = fixture.debugElement.componentInstance;
      void expect(app).toBeTruthy();
    }));
    describe('layout', (): void => {
      it('needs to be implemented');
    });
    describe('Component methods and attributes', (): void => {
      let fixture: ComponentFixture<DepartureListItemComponent>;
      let cmp: DepartureListItemComponent;
      beforeEach((): void => {
        fixture = TestBed.createComponent(DepartureListItemComponent);
        cmp = fixture.debugElement.componentInstance;
      });
      const testPassages: any[] = [
        [{ test: true }], [{ test: false }],
      ];
      describe('departure', (): void => {
        describe('getter', (): void => {
          testPassages.forEach((testPassage: any): void => {
            it('should get the correct value', (): void => {
              (cmp as any).mDeparture = testPassage;
              void expect(cmp.departure).toEqual(testPassage);
            });
          });
        });
        describe('setter', (): void => {
          let calculateDelaySpy: jasmine.Spy<jasmine.Func>;
          let convertTimeSpy: jasmine.Spy<jasmine.Func>;
          beforeEach((): void => {
            calculateDelaySpy = spyOn(cmp, 'calculateDelay');
            convertTimeSpy = spyOn(cmp, 'convertTime');
            calculateDelaySpy.and.callFake((arg: any): any =>
              ({ delay: arg }));
            convertTimeSpy.and.callFake((arg: any): any =>
              ({ time: arg }));
          });
          testPassages.forEach((testPassage: any): void => {
            it('should set the correct value', (): void => {
              cmp.departure = testPassage;
              void expect((cmp as any).mDeparture).toEqual(testPassage);
              void expect(calculateDelaySpy).toHaveBeenCalledTimes(1);
              void expect(convertTimeSpy).toHaveBeenCalledTimes(1);
              void expect(calculateDelaySpy).toHaveBeenCalledWith(testPassage);
              void expect(convertTimeSpy).toHaveBeenCalledWith(testPassage);
              void expect((cmp as any).mTime).toEqual({ time: testPassage });
              void expect((cmp as any).mDelay).toEqual({ delay: testPassage });
            });
          });
          afterEach((): void => {
            calculateDelaySpy.calls.reset();
            convertTimeSpy.calls.reset();
          });
        });
      });
      describe('time', (): void => {
        describe('getter', (): void => {
          testPassages.forEach((value: any): void => {
            it(`should convert the object to "${value}"`, (): void => {
              (cmp as any).mTime = value;
              void expect(cmp.time).toEqual(value);
            });
          });
        });
      });
      describe('delay', (): void => {
        describe('getter', (): void => {
          testPassages.forEach((value: any): void => {
            it(`should convert the object to "${value}"`, (): void => {
              (cmp as any).mDelay = value;
              void expect(cmp.delay).toEqual(value);
            });
          });
        });
      });
      describe('convertTime(departure)', (): void => {
        let testClock: jasmine.Clock;
        const baseTime: Date = new Date(2013, 9, 23, 12, 12);
        beforeEach((): void => {
          testClock = jasmine.clock();
          testClock.mockDate(baseTime);
        });
        afterEach((): void => {
          testClock.uninstall();
        });
        it('should show a short time', (): void => {
          const planned: Date = dateFns.add(baseTime, {
            seconds: 2000,
          });
          void expect(cmp.convertTime({
            actualRelativeTime: 2000,
          } as any)).toEqual(dateFns.format(planned, 'p'));
        });
        it('should show a positive time delta', (): void => {
          const planned: Date = dateFns.add(baseTime, {
            seconds: 20,
          });
          void expect(cmp.convertTime({
            actualRelativeTime: 20,
          } as any)).toEqual(dateFns.formatDistanceToNow(planned, { addSuffix: true }));
        });
        it('should show a negative time delta', (): void => {
          const planned: Date = dateFns.add(baseTime, {
            seconds: -500,
          });
          void expect(cmp.convertTime({
            actualRelativeTime: -500,
          } as any)).toEqual(dateFns.formatDistanceToNow(planned, { addSuffix: true }));
        });
      });
      describe('calculateDelay(departure)', (): void => {
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
        passages.forEach((value: any): void => {
          it(`should convert the "${value.value}" to "${value.result}"`, (): void => {
            void expect(cmp.calculateDelay(value.value)).toEqual(value.result);
          });
        });
      });
    });
  });
});
