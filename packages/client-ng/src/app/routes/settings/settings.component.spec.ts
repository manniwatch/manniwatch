/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsComponent } from './settings.component';

/* eslint-disable max-classes-per-file */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/directive-selector */
@Component({
    selector: 'mat-nav-list',
    template: '<div></div>',
})
class TestMatListComponent {
}
@Component({
    selector: 'mat-list-item',
    template: '<div></div>',
})
class TestMatListItemComponent {
}
@Component({
    selector: 'mat-divider',
    template: '<div></div>',
})
class TestMatDividerComponent {
}

@Component({
    selector: 'mat-icon',
    template: '<div></div>',
})
class TestMatIconComponent {

}

/* eslint-enable @angular-eslint/component-selector */
/* eslint-enable @angular-eslint/directive-selector */

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
                imports: [
                    RouterTestingModule,
                ],
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
