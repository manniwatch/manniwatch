/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchComponent } from './search.component';

// tslint:disable:max-classes-per-file
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

describe('src/modules/routing/search/search.component.ts', (): void => {
    describe('SearchComponent', (): void => {
        let cmp: SearchComponent;
        let fixture: ComponentFixture<SearchComponent>;
        let getTitleSpy: jasmine.Spy<jasmine.Func>;
        beforeAll((): void => {
            getTitleSpy = jasmine.createSpy();
        });
        beforeEach(async((): void => {
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
        afterEach((): void => {
            getTitleSpy.calls.reset();
        });

        it('should create the component', async((): void => {
            expect(cmp).toBeTruthy();
        }));
    });
});
