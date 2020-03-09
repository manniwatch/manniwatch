import { Component, HostBinding, Input } from '@angular/core';
@Component({
    selector: 'app-map-header-box',
    styleUrls: ['./map-header-box.component.scss'],
    templateUrl: './map-header-box.component.pug',
})
export class MapHeaderBoxComponent {

    @Input()
    public title: string = undefined;
    @Input()
    public subtitle: string = undefined;
    @Input()
    @HostBinding('class.no-location')
    public blur = false;
}
