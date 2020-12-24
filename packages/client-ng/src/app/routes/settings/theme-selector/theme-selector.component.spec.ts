/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NEVER } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { SettingsService, Theme } from 'src/app/services';
import { ThemeSelectorComponent } from './theme-selector.component';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-selection-list',
    template: '<ng-content></ng-content>',
})
class TestMatSelectionListComponent {
}
@Component({
    selector: 'mat-list-option',
    template: '<ng-content></ng-content>',
})
class TestMatListOptionComponent {
}
@Component({
    selector: 'mat-icon',
    template: '<ng-content></ng-content>',
})
class TestMatIconComponent {
}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/routes/settings/theme-selector/theme-selector.component.ts', (): void => {
    describe('ThemeSelectorComponent', (): void => {
        let fixture: ComponentFixture<ThemeSelectorComponent>;
        let app: ThemeSelectorComponent;
        let setThemeSpy: jasmine.Spy<jasmine.Func>;
        let themeObservableSubscribeSpy: jasmine.Spy<jasmine.Func>;
        beforeAll((): void => {
            setThemeSpy = jasmine.createSpy('setTheme');
            themeObservableSubscribeSpy = jasmine.createSpy('themeObservable.subscribe');
        });
        beforeEach(waitForAsync((): void => {
            TestBed.configureTestingModule({
                declarations: [
                    ThemeSelectorComponent,
                    TestMatSelectionListComponent,
                    TestMatListOptionComponent,
                    TestMatIconComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [
                    {
                        provide: SettingsService,
                        useValue: {
                            set theme(th: Theme) {
                                setThemeSpy(th);
                            },
                            get themeObservable(): any {
                                return themeObservableSubscribeSpy();
                            },
                        },
                    },
                ],
            }).compileComponents();
            fixture = TestBed.createComponent(ThemeSelectorComponent);
            app = fixture.debugElement.componentInstance;
        }));
        afterEach((): void => {
            setThemeSpy.calls.reset();
            themeObservableSubscribeSpy.calls.reset();
        });

        it('should create the app', waitForAsync((): void => {
            expect(app).toBeTruthy();
        }));
        describe('layout', (): void => {
            it('needs to be implemented');
        });
        describe('methods', (): void => {
            describe('selectTheme', (): void => {
                it('should call through to setTheme on settingservice', (): void => {
                    expect(setThemeSpy).not.toHaveBeenCalled();
                    app.selectTheme(Theme.DARK);
                    expect(setThemeSpy).toHaveBeenCalledTimes(1);
                    expect(setThemeSpy).toHaveBeenCalledWith(Theme.DARK);
                });
            });
            describe('onSelectionChange', (): void => {
                it('should call through to setTheme on settingservice', (): void => {
                    expect(setThemeSpy).not.toHaveBeenCalled();
                    app.onSelectionChange({ options: [{ value: Theme.DARK }] } as any);
                    expect(setThemeSpy).toHaveBeenCalledTimes(1);
                    expect(setThemeSpy).toHaveBeenCalledWith(Theme.DARK);
                });
            });
            describe('ngOnInit', (): void => {
                it('should subscribe correctly', (): void => {
                    expect((app as any).themeSubscription).not.toBeDefined();
                    app.theme = Theme.LIGHT;
                    themeObservableSubscribeSpy.and.returnValue(NEVER.pipe(startWith(Theme.DARK)));
                    expect(themeObservableSubscribeSpy).toHaveBeenCalledTimes(0);
                    app.ngOnInit();
                    expect(themeObservableSubscribeSpy).toHaveBeenCalledTimes(1);
                    expect(app.theme).toEqual(Theme.DARK as any, 'Expected theme to be set to dark');
                });
            });
            describe('ngOnDestroy', (): void => {
                it('should not throw without subscription', (): void => {
                    expect((): void => {
                        app.ngOnDestroy();
                    }).not.toThrow();
                });
                it('should unsubscribe correctly', (): void => {
                    const unsubscribeSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('unsubscribe');
                    (app as any).themeSubscription = { unsubscribe: unsubscribeSpy };
                    expect((): void => {
                        app.ngOnDestroy();
                    }).not.toThrow();
                    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
});
