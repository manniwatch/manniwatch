/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonErrorComponent } from './common-error.component';
import { ErrorRoutingModule } from './error-routing.module';
import { NotFoundMessageSwitchComponent } from './not-found-msg-switch.component';
import { NotFoundComponent } from './not-found.component';
@NgModule({
    declarations: [
        NotFoundComponent,
        CommonErrorComponent,
        NotFoundMessageSwitchComponent,
    ],
    imports: [
        ErrorRoutingModule,
        CommonModule,
        MatListModule,
        MatIconModule,
        MatDividerModule,
    ],
    providers: [
    ],
})
export class ErrorModule { }
