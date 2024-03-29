/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class SidebarService {
    public get sidebarOpen(): boolean {
        return this.mSidebarStatusSubject.value;
    }
    public get sidebarObservable(): Observable<boolean> {
        return this.mSidebarStatusSubject.asObservable();
    }
    private mSidebarStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public toggleSidebar(): void {
        this.mSidebarStatusSubject.next(!this.mSidebarStatusSubject.getValue());
    }

    public openSidebar(): void {
        this.mSidebarStatusSubject.next(true);
    }

    public closeSidebar(): void {
        this.mSidebarStatusSubject.next(false);
    }
}
