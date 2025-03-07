/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsComponent } from './settings.component';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-nav-list',
    standalone: false,
    template: '<div></div>',
})
class TestMatListComponent {}
@Component({
    selector: 'mat-list-item',
    standalone: false,
    template: '<div></div>',
})
class TestMatListItemComponent {}
@Component({
    selector: 'mat-divider',
    standalone: false,
    template: '<div></div>',
})
class TestMatDividerComponent {}

@Component({
    selector: 'mat-icon',
    standalone: false,
    template: '<div></div>',
})
class TestMatIconComponent {}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/routes/settings/settings.component.ts', (): void => {
    describe('SettingsComponent', (): void => {
        let fixture: ComponentFixture<SettingsComponent>;
        let app: SettingsComponent;
        beforeEach(waitForAsync((): void => {
            TestBed.configureTestingModule({
                declarations: [
                    SettingsComponent,
                    TestMatListComponent,
                    TestMatDividerComponent,
                    TestMatListItemComponent,
                    TestMatIconComponent,
                ],
                imports: [RouterTestingModule],
                providers: [],
            }).compileComponents();
            fixture = TestBed.createComponent(SettingsComponent);
            app = fixture.debugElement.componentInstance;
        }));

        it('should create the app', waitForAsync((): void => {
            expect(app).toBeTruthy();
        }));
        describe('layout', (): void => {
            it('needs to be implemented');
        });
    });
});
