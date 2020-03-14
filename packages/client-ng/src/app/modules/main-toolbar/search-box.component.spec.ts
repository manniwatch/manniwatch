/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component, Directive, EventEmitter, Input, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { StopPointService } from './../../services/stop-point.service';
import { ToolbarSearchBoxComponent } from './search-box.component';

// tslint:disable:max-classes-per-file
// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-form-field',
    template: '<div></div>',
})
class TestMatFormFieldComponent {
}

@Directive({
    selector: 'input',
})
class TestFormControlDirective {
    @Input()
    public formControl: any;
    @Input()
    public matAutocomplete: any;
}

@Component({
    selector: 'mat-option',
    template: '<div></div>',
})
class TestMatOptionComponent {
    @Input()
    public value: any;
}

@Component({
    exportAs: 'matAutocomplete',
    selector: 'mat-autocomplete',
    template: '<div></div>',
})
class TestMatAutoCompleteComponent {
    @Input()
    public displayWith: ((inp: any) => string);
    @Output()
    public optionSelected: EventEmitter<MatAutocompleteSelectedEvent> = new EventEmitter();
}

@Component({
    selector: 'mat-icon',
    template: '<div></div>',
})
class TestMatIconComponent {
}

// tslint:enable:component-selector
// tslint:enable:directive-selector

class TestStopPointService {

}

describe('src/modules/main-toolbar/search-box.component.ts', (): void => {
    describe('ToolbarSearchBoxComponent', (): void => {
        beforeEach(async((): void => {
            TestBed.configureTestingModule({
                declarations: [
                    ToolbarSearchBoxComponent,
                    TestMatIconComponent,
                    TestMatAutoCompleteComponent,
                    TestMatOptionComponent,
                    TestMatFormFieldComponent,
                    TestFormControlDirective,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [
                    {
                        provide: StopPointService,
                        useValue: new TestStopPointService(),
                    },
                ],
            }).compileComponents();
        }));

        it('should create the app', async((): void => {
            const fixture: ComponentFixture<ToolbarSearchBoxComponent> = TestBed.createComponent(ToolbarSearchBoxComponent);
            const app: ToolbarSearchBoxComponent = fixture.debugElement.componentInstance;
            expect(app).toBeTruthy();
        }));
    });
});
