/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { RequestUpdateDialogComponent } from './request-update-dialog.component';
import { RequestUpdateDialogService, SW_STATUS } from './request-update-dialog.service';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-spinner',
    template: '',
})
class TestMatSpinnerComponent {
}

@Component({
    selector: 'mat-dialog-actions',
    template: '<ng-content></ng-content>',
})
class TestMatDialogActionsComponent {
}

@Component({
    selector: 'mat-icon',
    template: '<div></div>',
})
class TestMatIconComponent {
}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/app/modules/request-update-dialog/request-update-dialog.component.ts', (): void => {
    describe('RequestUpdateDialogComponent', (): void => {
        const statusSubject: BehaviorSubject<SW_STATUS> = new BehaviorSubject(SW_STATUS.LOADING);
        const testDialogService: any = {
            statusObservable: statusSubject,
        };
        const testDialogRef: any = {

        };
        beforeEach(waitForAsync((): void => {
            TestBed.configureTestingModule({
                declarations: [
                    RequestUpdateDialogComponent,
                    TestMatIconComponent,
                    TestMatDialogActionsComponent,
                    TestMatSpinnerComponent,
                ],
                imports: [
                ],
                providers: [
                    {
                        provide: RequestUpdateDialogService,
                        useValue: testDialogService,
                    },
                    {
                        provide: MatDialogRef,
                        useValue: testDialogRef,
                    },
                ],
            })
                .overrideComponent(RequestUpdateDialogComponent, {
                    set: {
                        providers: [
                            { provide: RequestUpdateDialogService, useValue: testDialogService },
                        ],
                    },
                }).compileComponents();
        }));

        describe('layout', (): void => {
            let cmpFixture: ComponentFixture<RequestUpdateDialogComponent>;
            let cmp: RequestUpdateDialogComponent;
            beforeEach(waitForAsync((): void => {
                cmpFixture = TestBed.createComponent(RequestUpdateDialogComponent);
                cmp = cmpFixture.debugElement.componentInstance;
            }));
            it('should create the component', waitForAsync((): void => {
                expect(cmp).toBeTruthy();
            }));
            it('should display loading spinner if status equals "loading"', waitForAsync(async (): Promise<void> => {
                statusSubject.next(SW_STATUS.LOADING);
                cmpFixture.detectChanges();
                statusSubject.next(SW_STATUS.LOADING);
                cmpFixture.detectChanges();
                await cmpFixture.whenStable();
                const debugElement: DebugElement = cmpFixture.debugElement.query(By.directive(TestMatSpinnerComponent));
                expect(debugElement).toBeTruthy();
            }));
            it('should display that no update is available', waitForAsync(async (): Promise<void> => {
                statusSubject.next('unknown status' as any);
                cmpFixture.detectChanges();
                await cmpFixture.whenStable();
                const debugElement: DebugElement = cmpFixture.debugElement.query(By.css('mat-dialog-content'));
                expect(debugElement).toBeTruthy();
                expect(debugElement.nativeElement.innerText).toEqual('No Update available!');
            }));
        });
    });
});
