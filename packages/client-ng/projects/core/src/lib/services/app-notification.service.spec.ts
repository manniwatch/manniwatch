/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { async, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AppNotificationService } from './app-notification.service';
// import * as sinon from "sinon";
describe('src/app/services/app-notification.service', (): void => {
    describe('AppNotificationService', (): void => {
        let notificationService: AppNotificationService;
        let nextSpy: jasmine.Spy<jasmine.Func>;
        let subject: BehaviorSubject<boolean>;
        beforeAll((): void => {
            nextSpy = jasmine.createSpy();
        });
        beforeEach(async((): void => {
            TestBed.configureTestingModule({
                providers: [AppNotificationService],
            });
            notificationService = TestBed.inject(AppNotificationService);
            subject = (notificationService as any).notificationSubject;
        }));

        afterEach((): void => {
            nextSpy.calls.reset();
        });

        describe('notificationObservable', (): void => {
            it('needs to be implemented');
        });
    });
});
