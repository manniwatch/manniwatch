import { Component, Input } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StopPointService } from 'src/app/services';
import { SearchResultResolver } from './search-result.resolver';
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

describe('src/modules/routing/search/search-result.resolver.ts', () => {
    describe('SearchResultResolver', () => {
        let stopLocationSpy: jasmine.Spy<jasmine.Func>;
        let testResolver: SearchResultResolver;
        beforeAll(() => {
            stopLocationSpy = jasmine.createSpy();
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
                    SearchResultResolver,
                    {
                        provide: StopPointService,
                        useValue: {
                            stopLocationsObservable: stopLocationSpy,
                        },
                    },
                ],
            }).compileComponents();
            testResolver = TestBed.get(SearchResultResolver);
        }));
        afterEach(() => {
            stopLocationSpy.calls.reset();
        });

        it('should create the component', async(() => {
            expect(testResolver).toBeTruthy();
        }));
    });
});
