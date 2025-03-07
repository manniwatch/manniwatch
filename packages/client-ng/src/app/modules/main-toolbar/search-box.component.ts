/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, filter, startWith } from 'rxjs/operators';
@Component({
    selector: 'app-toolbar-search',
    standalone: false,
    styleUrls: ['./search-box.component.scss'],
    templateUrl: './search-box.component.html',
})
export class ToolbarSearchBoxComponent implements OnInit, OnDestroy {
    public searchControl: UntypedFormControl = new UntypedFormControl();

    @ViewChild('searchInput')
    public searchInput: ElementRef;

    @Output()
    public readonly focusSearch: EventEmitter<boolean> = new EventEmitter<boolean>();
    private updateSubscription: Subscription;
    constructor(private router: Router) {}

    public onLoseFocus(): void {
        this.focusSearch.next(false);
    }

    public ngOnInit(): void {
        this.updateSubscription = this.searchControl.valueChanges
            .pipe(
                startWith(''),
                filter((value: string): boolean => value.length > 0),
                debounceTime(200)
            )
            .subscribe((value: string): void => {
                void this.router.navigate(['search'], {
                    queryParams: {
                        q: value,
                    },
                    replaceUrl: value.length > 1,
                });
            });
    }

    public onSubmit(): void {
        void this.router.navigate(['search'], {
            queryParams: {
                q: this.searchControl.value as string,
            },
            skipLocationChange: false,
        });
    }

    public ngOnDestroy(): void {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }
}
