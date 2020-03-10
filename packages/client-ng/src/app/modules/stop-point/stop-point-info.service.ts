import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IActualDeparture, IRoute, IStopPassage, IStopPointLocation, StopShortName } from '@donmahallem/trapeze-api-types';
import { combineLatest, merge, timer, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, flatMap, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { ApiService, StopPointService } from 'src/app/services';

export interface IStatus {
    location?: IStopPointLocation;
    passages: IStopPassage;
}
@Injectable()
export class StopPointInfoService {

    public get actualPassagesObservable(): Observable<IActualDeparture[]> {
        return this.passagesObservable
            .pipe(map((data: IStopPassage): IActualDeparture[] =>
                data.actual || []));
    }
    public get routesObservable(): Observable<IRoute[]> {
        return this.passagesObservable
            .pipe(map((data: IStopPassage): IRoute[] =>
                data.routes || []), distinctUntilChanged((prev: IRoute[], curr: IRoute[]): boolean => {
                    if (prev.length !== curr.length) {
                        return false;
                    }
                    for (let i: number = 0; i < prev.length; i++) {
                        if (prev[i].id !== curr[i].id) {
                            return false;
                        }
                    }
                    return true;
                }));
    }
    public readonly statusObservable: Observable<IStatus>;
    public readonly locationObservable: Observable<IStopPointLocation>;
    public readonly passagesObservable: Observable<IStopPassage>;
    private readonly mStatusSubject: Subject<StopShortName> = new Subject();
    constructor(private route: ActivatedRoute,
                private apiService: ApiService,
                stopService: StopPointService) {
        const stopPointIdObservable: Observable<string> = this.route.params
            .pipe(map((params: any): string =>
                params.stopPointId));
        const resolverData: Observable<IStopPassage> = this.route.data
            .pipe(map((data: any): IStopPassage =>
                data.stopPoint));
        const d: Observable<IStopPassage> = this.mStatusSubject
            .pipe(switchMap((name: any) =>
                timer(5000).pipe(flatMap(() =>
                    this.apiService
                        .getStopPointPassages(name))))) as Observable<IStopPassage>;
        this.passagesObservable = merge(resolverData, d)
            .pipe(tap((stop: IStopPassage) => {
                this.mStatusSubject.next(stop.stopShortName);
            }), shareReplay(1));
        this.locationObservable = combineLatest([stopPointIdObservable, stopService.stopPointObservable])
            .pipe(map((data: [string, IStopPointLocation[]]) => {
                const idx: number = data[1].findIndex((stp: IStopPointLocation) =>
                    stp.stopPoint === data[0]);
                return idx >= 0 ? data[1][idx] : undefined;
            }), distinctUntilChanged((x: IStopPointLocation, y: IStopPointLocation): boolean => {
                if (x && y) {
                    return x.id === y.id;
                }
                return false;
            }), shareReplay(1));
        this.statusObservable = combineLatest([this.passagesObservable, this.locationObservable])
            .pipe(map((val: [IStopPassage, IStopPointLocation]): IStatus =>
                ({
                    location: val[1],
                    passages: val[0],
                })), shareReplay(1));
    }
}
