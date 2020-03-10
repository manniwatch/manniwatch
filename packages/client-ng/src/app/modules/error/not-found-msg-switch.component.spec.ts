/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { DebugElement, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('src/modules/error/not-found-msg-switch.component.ts', () => {
    describe('NotFoundMessageSwitchComponent', () => {
        let cmpFixture: ComponentFixture<NotFoundMessageSwitchComponent>;
        let cmp: NotFoundComponent;
        let testActivatedRoute: TestActivatedRoute;
        let infoBoxDebugElement: DebugElement;
        beforeEach(async(() => {
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
            testActivatedRoute = TestBed.get(ActivatedRoute);
            infoBoxDebugElement = cmpFixture.debugElement.query(By.css('div.info'));
        }));
        it('should create the app', async(() => {
            expect(cmp).toBeTruthy();
            expect(infoBoxDebugElement.componentInstance).toBeTruthy();
        }));
        describe('error type is provided', () => {
            describe('error type is ' + ErrorType.PASSAGE_NOT_FOUND, () => {
                beforeEach(() => {
                    testActivatedRoute.queryParams.next({
                        type: ErrorType.PASSAGE_NOT_FOUND,
                    });
                    cmpFixture.detectChanges();
                });
                it('should only display that the passage could not be found', () => {
                    expect(infoBoxDebugElement.nativeElement.textContent)
                        .toEqual('The passage could not be found. It either expired or has yet to start.Please select another passage.');
                });
            });
            describe('error type is ' + ErrorType.VEHICLE_NOT_FOUND, () => {
                beforeEach(() => {
                    testActivatedRoute.queryParams.next({
                        type: ErrorType.VEHICLE_NOT_FOUND,
                    });
                    cmpFixture.detectChanges();
                });
                it('should only display that the vehicle could not be found', () => {
                    expect(infoBoxDebugElement.nativeElement.textContent)
                        .toEqual('The requested vehicle could not be found. It might not be active at the moment.');
                });
            });
            describe('error type is an unsupported value', () => {
                beforeEach(() => {
                    testActivatedRoute.queryParams.next({
                        type: -100,
                    });
                    cmpFixture.detectChanges();
                });
                it('should only display that the requested resource could not be found', () => {
                    expect(infoBoxDebugElement.nativeElement.textContent).toEqual('The requested resource can not be found.');
                });
            });
        });
    });
});
