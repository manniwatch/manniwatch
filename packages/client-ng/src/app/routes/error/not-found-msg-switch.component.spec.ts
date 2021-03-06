/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { DebugElement, Injectable } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { ErrorType } from './error-type';
import { NotFoundMessageSwitchComponent } from './not-found-msg-switch.component';
import { NotFoundComponent } from './not-found.component';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector

@Injectable()
class TestActivatedRoute {
    public queryParams: BehaviorSubject<{
        type?: any;
    }> = new BehaviorSubject({});
}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/modules/error/not-found-msg-switch.component.ts', (): void => {
    describe('NotFoundMessageSwitchComponent', (): void => {
        let cmpFixture: ComponentFixture<NotFoundMessageSwitchComponent>;
        let cmp: NotFoundComponent;
        let testActivatedRoute: TestActivatedRoute;
        let infoBoxDebugElement: DebugElement;
        beforeEach(waitForAsync((): void => {
            TestBed.configureTestingModule({
                declarations: [
                    NotFoundMessageSwitchComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [
                    { provide: ActivatedRoute, useClass: TestActivatedRoute },
                ],
            }).compileComponents();
            cmpFixture = TestBed.createComponent(NotFoundMessageSwitchComponent);
            cmp = cmpFixture.debugElement.componentInstance;
            testActivatedRoute = TestBed.inject(ActivatedRoute) as any;
            infoBoxDebugElement = cmpFixture.debugElement.query(By.css('div.info'));
        }));
        it('should create the app', waitForAsync((): void => {
            expect(cmp).toBeTruthy();
            expect(infoBoxDebugElement.componentInstance).toBeTruthy();
        }));
        describe('error type is provided', (): void => {
            describe(`error type is ${ErrorType.PASSAGE_NOT_FOUND}`, (): void => {
                beforeEach((): void => {
                    testActivatedRoute.queryParams.next({
                        type: ErrorType.PASSAGE_NOT_FOUND,
                    });
                    cmpFixture.detectChanges();
                });
                it('should only display that the passage could not be found', (): void => {
                    expect(infoBoxDebugElement.nativeElement.textContent)
                        .toEqual('The passage could not be found. It either expired or has yet to start.Please select another passage.');
                });
            });
            describe(`error type is ${ErrorType.VEHICLE_NOT_FOUND}`, (): void => {
                beforeEach((): void => {
                    testActivatedRoute.queryParams.next({
                        type: ErrorType.VEHICLE_NOT_FOUND,
                    });
                    cmpFixture.detectChanges();
                });
                it('should only display that the vehicle could not be found', (): void => {
                    expect(infoBoxDebugElement.nativeElement.textContent)
                        .toEqual('The requested vehicle could not be found. It might not be active at the moment.');
                });
            });
            describe('error type is an unsupported value', (): void => {
                beforeEach((): void => {
                    testActivatedRoute.queryParams.next({
                        type: -100,
                    });
                    cmpFixture.detectChanges();
                });
                it('should only display that the requested resource could not be found', (): void => {
                    expect(infoBoxDebugElement.nativeElement.textContent).toEqual('The requested resource can not be found.');
                });
            });
        });
    });
});
