/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatToolbarModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { MainToolbarComponent } from './main-toolbar.component';
import { RouteLoadingIndicatorComponent } from './route-loading-indicator.component';
import { ToolbarSearchBoxComponent } from './search-box.component';

@NgModule({
    declarations: [
        MainToolbarComponent,
        ToolbarSearchBoxComponent,
        RouteLoadingIndicatorComponent,
    ],
    exports: [
        MainToolbarComponent,
        CommonModule,
        MatIconModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        RouterModule,
        ToolbarSearchBoxComponent,
        RouteLoadingIndicatorComponent,
        MatProgressBarModule,
        MatDividerModule,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatDividerModule,
        RouterModule,
        MatProgressBarModule,
    ],
    providers: [
    ],
})
export class MainToolbarModule { }
