/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, Input } from '@angular/core';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StopPointService } from 'src/app/services';
import { SearchResultResolver } from './search-result.resolver';
import { SearchComponent } from './search.component';

/* eslint-disable max-classes-per-file */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/directive-selector */

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

/* eslint-enable @angular-eslint/component-selector */
/* eslint-enable @angular-eslint/directive-selector */

describe('src/modules/routing/search/search-result.resolver.ts', (): void => {
    describe('SearchResultResolver', (): void => {
        let stopLocationSpy: jasmine.Spy<jasmine.Func>;
        let testResolver: SearchResultResolver;
        beforeAll((): void => {
            stopLocationSpy = jasmine.createSpy();
        });
        beforeEach(waitForAsync((): void => {
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
