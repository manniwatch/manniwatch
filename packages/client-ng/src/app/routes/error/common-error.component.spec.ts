/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonErrorComponent } from './common-error.component';

/* eslint-disable max-classes-per-file */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/directive-selector */
@Component({
    selector: 'mat-icon',
    template: '<div></div>',
})
class TestMatIconComponent {
}

/* eslint-enable @angular-eslint/component-selector */
/* eslint-enable @angular-eslint/directive-selector */

describe('src/modules/error/common.component.ts', (): void => {
    describe('CommonComponent', (): void => {
        let cmpFixture: ComponentFixture<CommonErrorComponent>;
        let cmp: CommonErrorComponent;
        beforeEach(waitForAsync((): void => {
            TestBed.configureTestingModule({
                declarations: [
                    CommonErrorComponent,
                    TestMatIconComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [],
            }).compileComponents();
            cmpFixture = TestBed.createComponent(CommonErrorComponent);
            cmp = cmpFixture.debugElement.componentInstance;
        }));

        it('should create the app', waitForAsync((): void => {
            expect(cmp).toBeTruthy();
        }));
    });
});
