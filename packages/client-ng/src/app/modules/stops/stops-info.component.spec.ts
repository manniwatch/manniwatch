/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StopsInfoComponent } from './stops-info.component';

// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-nav-list',
    template: '<div></div>',
})
class TestMatListComponent {
}
@Component({
    selector: 'mat-list-item',
    template: '<div></div>',
})
class TestMatListItemComponent {
}
@Component({
    selector: 'mat-divider',
    template: '<div></div>',
})
class TestMatDividerComponent {
}

@Component({
    selector: 'mat-icon',
    template: '<div></div>',
})
class TestMatIconComponent {

}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/modules/stops/stops-info.component.ts', () => {
    describe('StopsInfoComponent', () => {
        let fixture: ComponentFixture<StopsInfoComponent>;
        let app: StopsInfoComponent;
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    StopsInfoComponent,
                    TestMatListComponent,
                    TestMatDividerComponent,
                    TestMatListItemComponent,
                    TestMatIconComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            snapshot: {
                                data: {
                                    stops: {
                                        stops: [
                                            { name: 'c' },
                                            { name: 'aa' },
                                            { name: 'b' },
                                            { name: 'ab' },
                                        ],
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

        it('should create the app', async(() => {
            expect(app).toBeTruthy();
        }));
        describe('layout', () => {
            it('needs to done');
        });

        describe('Class', () => {
            describe('constructor', () => {
                it('should sort the provided stops', () => {
                    const stops = (app as any).mStops;
                    expect(stops[0].name).toEqual('aa');
                    expect(stops[1].name).toEqual('ab');
                    expect(stops[2].name).toEqual('b');
                    expect(stops[3].name).toEqual('c');
                });
            });
            describe('stops', () => {
                describe('getter', () => {
                    it('should return mStops', () => {
                        const stops = (app as any).mStops;
                        expect(app.stops).toEqual(stops);
                    });
                });
            });
            describe('hasHeader(idx)', () => {
                [true, false, true, true].forEach((responseValue, idx) => {
                    it('should return ' + responseValue + ' for idx: ' + idx, () => {
                        expect(app.hasHeader(idx)).toEqual(responseValue);
                    });
                });
            });
        });
    });
});
