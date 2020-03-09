/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Directive, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, timer, BehaviorSubject, Subscriber, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

/**
 * CountdownTimerDirective
 */
@Directive({
    selector: 'span[appCountdownTimer]',
})
export class CountdownTimerDirective implements OnInit, OnDestroy {

    /**
     * Sets the targetTime
     */
    @Input()
    public set targetTime(timestamp: number) {
        this.timestampSubject.next(timestamp);
    }

    /**
     * The innerHtml for the directive
     */
    @HostBinding('innerHTML')
    public get text() {
        return this.timestamp;
    }

    /**
     * Placeholder if time has run out
     */
    @Input()
    public placeholder = '-';

    private timestamp = '';
    private updateSubscription: Subscription;
    private timestampSubject: BehaviorSubject<number> = new BehaviorSubject(0);

    public ngOnInit(): void {
        this.updateSubscription = combineLatest([timer(0, 200), this.timestampSubject])
            .pipe(map((value: [number, number]): string => {
                const diff: number = Math.max(value[1] - Date.now(), 0);
                if (diff <= 0) {
                    return this.placeholder;
                } else {
                    return Math.ceil(diff / 1000.0) + 's';
                }
            }),
                distinctUntilChanged())
            .subscribe(new Subscriber((val) => {
                this.timestamp = val;
            }));

    }

    public ngOnDestroy(): void {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }
}
