import { BehaviorSubject, Observable } from 'rxjs';
import * as socketio from 'socket.io';
export class ConnectionTracker {
    private counterSubject: BehaviorSubject<number> = new BehaviorSubject(0);
    public track(socket: socketio.Socket): void {
        socket.on('connect', (): void => {
            this.counterSubject.next(this.counterSubject.value + 1);
        });
        socket.on('disconnect', (reason: string): void => {
            this.counterSubject.next(this.counterSubject.value - 1);
        });
    }
    public get connections(): Observable<number> {
        return this.counterSubject.asObservable();
    }
}