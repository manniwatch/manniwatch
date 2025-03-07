/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { IStopLocation } from '@manniwatch/api-types';
import { NEVER, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
    selector: 'app-search',
    standalone: false,
    styleUrls: ['./search.component.scss'],
    templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit, OnDestroy {
    public get results(): Observable<IStopLocation[]> {
        return this.resultObservable;
    }
    public data = '';
    private searchParamSubscription: Subscription;
    private resultObservable: Observable<IStopLocation[]> = NEVER;
    public constructor(
        private activatedRoute: ActivatedRoute,
        private titleService: Title
    ) {}

    public ngOnInit(): void {
        this.searchParamSubscription = this.activatedRoute.queryParams.subscribe((value: Params & { q?: string }): void => {
            this.data = value.q || '';
            this.titleService.setTitle(`Search - "${this.data}"`);
        });
        this.resultObservable = this.activatedRoute.data.pipe(
            map((val: Data): IStopLocation[] => {
                return (val.results || []) as IStopLocation[];
            })
        );
    }
    public ngOnDestroy(): void {
        if (this.searchParamSubscription) {
            this.searchParamSubscription.unsubscribe();
        }
    }
}
