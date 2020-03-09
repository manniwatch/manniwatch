import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RouteListComponent } from './route-list.component';

// tslint:disable:component-selector
// tslint:disable:directive-selector
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
// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/modules/stop/route-list.component.ts', () => {
    describe('RouteListComponent', () => {
        beforeEach(async(() => {
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

        beforeEach(() => {
            // testUploadDataService.
        });
        describe('as child element', () => {
            let fixture: ComponentFixture<TestParentComponent>;
            let component: TestParentComponent;
            let routeListCmp: RouteListComponent;
            beforeEach(() => {
                fixture = TestBed.createComponent(TestParentComponent);
                component = fixture.debugElement.componentInstance;
                routeListCmp = fixture.debugElement.query(By.directive(RouteListComponent)).componentInstance;
            });
            it('should create the components', () => {
                expect(component).toBeTruthy();
                expect(routeListCmp).toBeTruthy();
            });
            describe('test the "routes" input', () => {
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
                it('should set the testitem correctly as the input element', () => {
                    component.testData = testItem;
                    fixture.detectChanges();
                    expect(routeListCmp.routes)
                        .toEqual(testItem);
                });
            });
        });
        beforeAll(() => { });
        afterEach(() => { });
    });
});
