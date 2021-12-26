/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-header-box',
    styleUrls: ['./header-box.component.scss'],
    templateUrl: './header-box.component.html',
})
export class HeaderBoxComponent {
    @Input()
    public lastUpdate: Date = undefined;

    @Input()
    public title: string;
}
