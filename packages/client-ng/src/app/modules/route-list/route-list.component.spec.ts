/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RouteListComponent } from './route-list.component';

/* eslint-disable max-classes-per-file */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/directive-selector */
@Component({
    selector: 'mat-divider',
    template: '<div></div>',
})
export class TestMatDividerComponent {
}

@Component({
    selector: 'mat-list-item',
    template: '<div></div>',
})
export class TestMatListItemComponent {
}

@Component({
    selector: 'mat-list',
    template: '<div></div>',
})
export class TestMatListComponent {
}

@Component({
    template: '<app-route-list [routes]="testData"></app-route-list>',
})
export class TestParentComponent {
    public testData: any[];
}
/* eslint-enable @angular-eslint/component-selector */
/* eslint-enable @angular-eslint/directive-selector */

describe('src/modules/stop/route-list.component.ts', (): void => {
    describe('RouteListComponent', (): void => {
        beforeEach(waitForAsync((): void => {
            TestBed.configureTestingModule({
                declarations: [
                    RouteListComponent,
                    TestMatDividerComponent,
                    TestMatListItemComponent,
                    TestMatListComponent,
                    TestParentComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [
                ],
            }).compileComponents();
        }));

        beforeEach((): void => {
            // testUploadDataService.
        });
        describe('as child element', (): void => {
            let fixture: ComponentFixture<TestParentComponent>;
            let component: TestParentComponent;
            let routeListCmp: RouteListComponent;
            beforeEach((): void => {
                fixture = TestBed.createComponent(TestParentComponent);
                component = fixture.debugElement.componentInstance;
                routeListCmp = fixture.debugElement.query(By.directive(RouteListComponent)).componentInstance;
            });
            it('should create the components', (): void => {
                void expect(component).toBeTruthy();
                void expect(routeListCmp).toBeTruthy();
            });
            describe('test the "routes" input', (): void => {
                const testItem: any[] = [
                    {
                        directions: [
                            'test direction 1',
                            'test direction 2',
                        ],
                        shortName: '123',
                    },
                    {
                        directions: [
                            'other test direction 1',
                            'other test direction 2',
                        ],
                        shortName: '421',
                    },
                ];
                it('should set the testitem correctly as the input element', (): void => {
                    component.testData = testItem;
                    fixture.detectChanges();
                    void expect(routeListCmp.routes)
                        .toEqual(testItem);
                });
            });
        });
        beforeAll((): void => { });
        afterEach((): void => { });
    });
});
