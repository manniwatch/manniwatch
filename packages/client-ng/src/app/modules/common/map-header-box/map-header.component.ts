/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { Input, Directive } from '@angular/core';

@Directive()
export abstract class MapHeaderComponent {

    @Input()
    public lastUpdate: Date = undefined;
    /**
     * Title being displayed
     */
    public abstract get title(): string;
}
