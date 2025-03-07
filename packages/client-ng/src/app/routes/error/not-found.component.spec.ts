/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component, DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NotFoundComponent } from './not-found.component';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-icon',
    standalone: false,
    template: '<div></div>',
})
class TestMatIconComponent {}
@Component({
    selector: 'mat-divider',
    standalone: false,
    template: '<div></div>',
})
class TestMatDividerComponent {}
@Component({
    selector: 'mat-list-item',
    standalone: false,
    template: '<div></div>',
})
class TestMatListItemComponent {}
@Component({
    selector: 'mat-nav-list',
    standalone: false,
    template: '<ng-content></ng-content>',
})
class TestMatNavListComponent {}
@Component({
    selector: 'app-not-found-msg-switch',
    standalone: false,
    template: '<div></div>',
})
class TestNotFoundMessageSwitchComponent {}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/modules/error/not-found.component.ts', (): void => {
    describe('NotFoundComponent', (): void => {
        let cmpFixture: ComponentFixture<NotFoundComponent>;
        let cmp: NotFoundComponent;
        let matListDebugElements: DebugElement[];
        beforeEach(waitForAsync((): void => {
            TestBed.configureTestingModule({
                declarations: [
                    NotFoundComponent,
                    TestMatIconComponent,
                    TestMatListItemComponent,
                    TestMatNavListComponent,
                    TestNotFoundMessageSwitchComponent,
                    TestMatDividerComponent,
                ],
                imports: [RouterTestingModule],
                providers: [],
            }).compileComponents();
            cmpFixture = TestBed.createComponent(NotFoundComponent);
            cmpFixture.detectChanges();
            cmp = cmpFixture.debugElement.componentInstance;
            matListDebugElements = cmpFixture.debugElement.queryAll(By.css('mat-list-item'));
        }));
        it('should create the app', waitForAsync((): void => {
            expect(cmp).toBeTruthy();
        }));
        it('should create the correct number of list items', (): void => {
            expect(matListDebugElements.length).toEqual(2);
        });
    });
});
