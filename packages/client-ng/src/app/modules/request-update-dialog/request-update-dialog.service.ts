/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, Observable } from 'rxjs';
export enum SW_STATUS {
    LOADING = 'loading',
    UPDATE_AVAILABLE = 'update_available',
    NO_SERVICE_WORKER = 'no_service_worker',
    UNKNOWN_ERROR = 'unknown_error',
}
@Injectable()
export class RequestUpdateDialogService {

    public readonly statusObservable: Observable<SW_STATUS>;
    private readonly statusSubject: BehaviorSubject<SW_STATUS>;
    constructor(public swService: SwUpdate) {
        this.statusSubject = new BehaviorSubject(SW_STATUS.LOADING);
        this.statusObservable = this.statusSubject.asObservable();
        if (!this.swService.isEnabled) {
            this.statusSubject.next(SW_STATUS.NO_SERVICE_WORKER);
            return;
        }
        this.swService.checkForUpdate().then((): void => {
            this.statusSubject.next(SW_STATUS.UPDATE_AVAILABLE);
        })
            .catch((err: any): void => {
                this.statusSubject.next(SW_STATUS.UNKNOWN_ERROR);
            });
    }

    public forceUpdate(): Promise<void> {
        this.statusSubject.next(SW_STATUS.LOADING);
        return this.swService
            .activateUpdate()
            .then((): void => document.location.reload())
            .finally((): void => {
                this.statusSubject.next(SW_STATUS.UNKNOWN_ERROR);
            });
    }
}
