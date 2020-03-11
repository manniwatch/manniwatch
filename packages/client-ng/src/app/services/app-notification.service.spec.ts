/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { async, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AppNotificationService } from './app-notification.service';
// import * as sinon from "sinon";
describe('src/app/services/app-notification.service', () => {
    describe('AppNotificationService', () => {
        let notificationService: AppNotificationService;
        let nextSpy: jasmine.Spy<jasmine.Func>;
        let subject: BehaviorSubject<boolean>;
        beforeAll(() => {
            nextSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [AppNotificationService],
            });
            notificationService = TestBed.inject(AppNotificationService);
            subject = (notificationService as any).notificationSubject;
        }));

        afterEach(() => {
            nextSpy.calls.reset();
        });

        describe('notificationObservable', () => {
            it('needs to be implemented');
        });
    });
});
