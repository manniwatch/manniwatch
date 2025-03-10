/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StopsInfoComponent } from './stops-info.component';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-nav-list',
    standalone: false,
    template: '<div></div>',
})
class TestMatListComponent {}
@Component({
    selector: 'mat-list-item',
    standalone: false,
    template: '<div></div>',
})
class TestMatListItemComponent {}
@Component({
    selector: 'mat-divider',
    standalone: false,
    template: '<div></div>',
})
class TestMatDividerComponent {}

@Component({
    selector: 'mat-icon',
    standalone: false,
    template: '<div></div>',
})
class TestMatIconComponent {}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/modules/stops/stops-info.component.ts', (): void => {
    describe('StopsInfoComponent', (): void => {
        let fixture: ComponentFixture<StopsInfoComponent>;
        let app: StopsInfoComponent;
        beforeEach(waitForAsync((): void => {
            TestBed.configureTestingModule({
                declarations: [
                    StopsInfoComponent,
                    TestMatListComponent,
                    TestMatDividerComponent,
                    TestMatListItemComponent,
                    TestMatIconComponent,
                ],
                imports: [RouterTestingModule],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            snapshot: {
                                data: {
                                    stops: {
                                        stops: [{ name: 'c' }, { name: 'aa' }, { name: 'b' }, { name: 'ab' }],
                                    },
                                },
                            },
                        },
                    },
                ],
            }).compileComponents();
            fixture = TestBed.createComponent(StopsInfoComponent);
            app = fixture.debugElement.componentInstance;
        }));

        it('should create the app', waitForAsync((): void => {
            expect(app).toBeTruthy();
        }));
        describe('layout', (): void => {
            it('needs to done');
        });

        describe('Class', (): void => {
            describe('constructor', (): void => {
                it('should sort the provided stops', (): void => {
                    const stops: any[] = (app as any).mStops;
                    expect(stops[0].name).toEqual('aa');
                    expect(stops[1].name).toEqual('ab');
                    expect(stops[2].name).toEqual('b');
                    expect(stops[3].name).toEqual('c');
                });
            });
            describe('stops', (): void => {
                describe('getter', (): void => {
                    it('should return mStops', (): void => {
                        const stops: any[] = (app as any).mStops;
                        expect(app.stops).toEqual(stops);
                    });
                });
            });
            describe('hasHeader(idx)', (): void => {
                [true, false, true, true].forEach((responseValue: boolean, idx: number): void => {
                    it(`should return ${responseValue ? 'true' : 'false'} for idx: ${idx}`, (): void => {
                        expect(app.hasHeader(idx)).toEqual(responseValue);
                    });
                });
            });
        });
    });
});
