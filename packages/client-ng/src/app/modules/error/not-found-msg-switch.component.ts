/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorType } from './error-type';
@Component({
    selector: 'app-not-found-msg-switch',
    styleUrls: ['./not-found-msg-switch.component.scss'],
    templateUrl: './not-found-msg-switch.component.pug',
})
/**
 * Component showing eventually more helpful error message for non found elements.
 */
export class NotFoundMessageSwitchComponent {
    public errorTypeObservable: Observable<string>;
    constructor(private route: ActivatedRoute) {
        this.errorTypeObservable = this.route.queryParams
            .pipe(map((value) => {
                if (value.type) {
                    return value.type;
                }
                return ErrorType.UNKNOWN;
            }));
    }
}
