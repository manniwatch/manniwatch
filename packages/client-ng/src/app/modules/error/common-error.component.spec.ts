import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonErrorComponent } from './common-error.component';

// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-icon',
    template: '<div></div>',
})
class TestMatIconComponent {
}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/modules/error/common.component.ts', () => {
    describe('CommonComponent', () => {
        let cmpFixture: ComponentFixture<CommonErrorComponent>;
        let cmp: CommonErrorComponent;
        beforeEach(async(() => {
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

        it('should create the app', async(() => {
            expect(cmp).toBeTruthy();
        }));
    });
});
