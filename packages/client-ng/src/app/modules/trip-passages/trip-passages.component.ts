/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IActualTripPassage, TripId } from '@donmahallem/trapeze-api-types';
import { from, BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { catchError, debounceTime, flatMap, map } from 'rxjs/operators';
import { TripPassagesLocation } from 'src/app/models';
import { ApiService } from '../../services';

enum UpdateStatus {
    LOADING = 1,
    LOADED = 2,
    ERROR = 3,
    PAUSED = 4,
    UNKNOWN = 5,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
}

export interface IPassageStatus {
    status: UpdateStatus;
    passages: TripPassagesLocation;
    timestamp: number;
    failures?: number;
}
/**
 * Component displaying the TripPassages for a Trip
 */
@Component({
    selector: 'app-trip-passages',
    styleUrls: ['./trip-passages.component.scss'],
    templateUrl: './trip-passages.component.pug',
})
export class TripPassagesComponent implements AfterViewInit, OnDestroy {

    /**
     * Returns the TripPassages
     * @returns undefined or {@link TripPassagesLocation}
     */
    public get tripData(): TripPassagesLocation {
        if (this.status.value) {
            return this.status.value.passages;
        }
        return undefined;
    }

    /**
     * Returns the last timestamp when data was tried to be retrieved
     * @returns number or 0 if no timestamp is set
     */
    public get lastTimestamp(): number {
        if (this.status.value) {
            return this.status.value.timestamp;
        }
        return 0;
    }

    /**
     * Returns the current set update status or {@link UpdateStatus.LOADING}
     * @returns the {@link UpdateStatus}
     */
    public get statusCode(): UpdateStatus {
        if (this.status.value) {
            return this.status.value.status;
        }
        return UpdateStatus.LOADING;
    }

    /**
     * returns the current tripID
     */
    public get tripId(): TripId {
        return this.route.snapshot.params.tripId;
    }

    /**
     * short hand to retrieve route name
     */
    public get routeName(): string {
        return (this.tripData) ? this.tripData.routeName : '';
    }

    /**
     * List of passages
     */
    public get tripPassages(): IActualTripPassage[] {
        return (this.tripData !== undefined) ? this.tripData.actual : [];
    }
    public readonly DEBOUNCE_TIME: number = 5000;
    public readonly STATUS_OPS: typeof UpdateStatus = UpdateStatus;
    private status: BehaviorSubject<IPassageStatus> = new BehaviorSubject(undefined);
    private snapshotDataSubscription: Subscription;
    private pollSubscription: Subscription;
    constructor(private route: ActivatedRoute,
                private apiService: ApiService,
                private router: Router) {
        this.snapshotDataSubscription = this.route.data.subscribe((data) => {
            this.status.next({
                passages: data.tripPassages,
                status: UpdateStatus.LOADED,
                timestamp: Date.now(),
            });
        });
    }

    /**
     * Returns if an error has happened during the last update
     * @returns true if an error occured
     */
    public hasError(): boolean {
        return this.statusCode >= UpdateStatus.ERROR;
    }

    /**
     * Initializes the update observable
     */
    public ngAfterViewInit(): void {
        this.pollSubscription = this.status.pipe(debounceTime(this.DEBOUNCE_TIME),
            map(() =>
                this.route.snapshot.params.tripId),
            flatMap((tripId: TripId) =>
                this.apiService.getTripPassages(tripId)),
            map((passages: TripPassagesLocation): IPassageStatus =>
                ({
                    passages,
                    status: UpdateStatus.LOADED,
                    timestamp: Date.now(),
                })),
            catchError(this.handleError.bind(this)))
            .subscribe(new Subscriber((val: IPassageStatus) => {
                if (val.passages.tripId === this.tripId) {
                    this.status.next(val);
                } else {
                    // trigger so a reload can execute
                    this.status.next(this.status.value);
                }
            }));
    }
    /**
     * destroys created update observables
     */
    public ngOnDestroy(): void {
        if (this.snapshotDataSubscription) {
            this.snapshotDataSubscription.unsubscribe();
        }
        if (this.pollSubscription) {
            this.pollSubscription.unsubscribe();
        }
    }

    private handleError(err?: any): Observable<any> {
        let status: UpdateStatus = UpdateStatus.ERROR;
        if (err.status) {
            // Http Error
            const statusCode: number = err.status;
            if (statusCode === 404) {
                status = UpdateStatus.NOT_FOUND;
                this.router.navigate(['not-found'], {
                    queryParams: {
                        type: 'passages',
                    },
                });
            } else if (statusCode >= 500 && statusCode < 600) {
                status = UpdateStatus.SERVER_ERROR;
            }
        }
        const returnValue: IPassageStatus = Object.assign({}, this.status.value);
        returnValue.status = status;
        if (returnValue.failures) {
            returnValue.failures += 1;
        } else {
            returnValue.failures = 1;
        }
        return from([returnValue]);
    }

}
