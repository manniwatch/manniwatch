import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchComponent } from './search.component';

// tslint:disable:component-selector
// tslint:disable:directive-selector

@Component({
    selector: 'mat-nav-list',
    template: '<ng-content></ng-content>',
})
class TestMatNavListComponent {
    @Input()
    public value: any;
}
@Component({
    selector: 'mat-list-item',
    template: '<div></div>',
})
class TestMatListItemComponent {
    @Input()
    public value: any;
}

@Component({
    selector: 'mat-icon',
    template: '<div></div>',
})
class TestMatIconComponent {
}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/modules/routing/search/search.component.ts', () => {
    describe('SearchComponent', () => {
        let cmp: SearchComponent;
        let fixture: ComponentFixture<SearchComponent>;
        let getTitleSpy: jasmine.Spy<jasmine.Func>;
        beforeAll(() => {
            getTitleSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    SearchComponent,
                    TestMatIconComponent,
                    TestMatNavListComponent,
                    TestMatListItemComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [
                    {
                        provide: Title,
                        useValue: {
                            getTitle: getTitleSpy,
                        },
                    },
                ],
            }).compileComponents();
            fixture = TestBed.createComponent(SearchComponent);
            cmp = fixture.debugElement.componentInstance;
        }));
        afterEach(() => {
            getTitleSpy.calls.reset();
        });

        it('should create the component', async(() => {
            expect(cmp).toBeTruthy();
        }));
    });
});
