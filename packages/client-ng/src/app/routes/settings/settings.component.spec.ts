/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsComponent } from './settings.component';

// tslint:disable:max-classes-per-file
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

describe('src/routes/settings/settings.component.ts', (): void => {
    describe('SettingsComponent', (): void => {
        let fixture: ComponentFixture<SettingsComponent>;
        let app: SettingsComponent;
        beforeEach(async((): void => {
            TestBed.configureTestingModule({
                declarations: [
                    SettingsComponent,
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
            fixture = TestBed.createComponent(SettingsComponent);
            app = fixture.debugElement.componentInstance;
        }));

        it('should create the app', async((): void => {
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
                    it('should return ' + responseValue + ' for idx: ' + idx, (): void => {
                        expect(app.hasHeader(idx)).toEqual(responseValue);
                    });
                });
            });
        });
    });
});
