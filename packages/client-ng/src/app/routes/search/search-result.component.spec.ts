/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component, Input } from '@angular/core';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StopPointService } from 'src/app/services';
import { SearchResultResolver } from './search-result.resolver';
import { SearchComponent } from './search.component';

@Component({
    selector: 'mat-nav-list',
    standalone: false,
    template: '<ng-content></ng-content>',
})
class TestMatNavListComponent {
    @Input()
    public value: any;
}
@Component({
    selector: 'mat-list-item',
    standalone: false,
    template: '<div></div>',
})
class TestMatListItemComponent {
    @Input()
    public value: any;
}

@Component({
    selector: 'mat-icon',
    standalone: false,
    template: '<div></div>',
})
class TestMatIconComponent {}

describe('src/modules/routing/search/search-result.resolver.ts', (): void => {
    describe('SearchResultResolver', (): void => {
        let stopLocationSpy: jasmine.Spy<jasmine.Func>;
        let testResolver: SearchResultResolver;
        beforeAll((): void => {
            stopLocationSpy = jasmine.createSpy();
        });
        beforeEach(waitForAsync((): void => {
            TestBed.configureTestingModule({
                declarations: [SearchComponent, TestMatIconComponent, TestMatNavListComponent, TestMatListItemComponent],
                imports: [RouterTestingModule],
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
            testResolver = TestBed.inject(SearchResultResolver);
        }));
        afterEach((): void => {
            stopLocationSpy.calls.reset();
        });

        it('should create the component', waitForAsync((): void => {
            expect(testResolver).toBeTruthy();
        }));
    });
});
