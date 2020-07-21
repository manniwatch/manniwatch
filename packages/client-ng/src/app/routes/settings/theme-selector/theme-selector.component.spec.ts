/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsService } from 'src/app/services';
import { ThemeSelectorComponent } from './theme-selector.component';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-action-list',
    template: '<ng-content></ng-content>',
})
class TestMatListComponent {
}
@Component({
    selector: 'button[mat-list-item]',
    template: '<div></div>',
})
class TestMatListItemComponent {
}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/routes/settings/theme-selector/theme-selector.component.ts', (): void => {
    describe('ThemeSelectorComponent', (): void => {
        let fixture: ComponentFixture<ThemeSelectorComponent>;
        let app: ThemeSelectorComponent;
        let setThemeSpy: jasmine.Spy<jasmine.Func>;
        beforeAll((): void => {
            setThemeSpy = jasmine.createSpy();
        });
        beforeEach(async((): void => {
            TestBed.configureTestingModule({
                declarations: [
                    ThemeSelectorComponent,
                    TestMatListComponent,
                    TestMatListItemComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [
                    {
                        provide: SettingsService,
                        useValue: {
                            setTheme: setThemeSpy,
                        },
                    },
                ],
            }).compileComponents();
            fixture = TestBed.createComponent(ThemeSelectorComponent);
            app = fixture.debugElement.componentInstance;
        }));
        afterEach((): void => {
            setThemeSpy.calls.reset();
        });

        it('should create the app', async((): void => {
            expect(app).toBeTruthy();
        }));
        describe('layout', (): void => {
            it('needs to be implemented');
        });
    });
});
