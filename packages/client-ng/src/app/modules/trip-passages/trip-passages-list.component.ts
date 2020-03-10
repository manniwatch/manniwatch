import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';
import { ITripPassage } from '@donmahallem/trapeze-api-types';
import { TripInfoWithId } from 'src/app/services';

/**
 * List of Departures Component
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-trip-passages-list',
    styleUrls: ['./trip-passages-list.component.scss'],
    templateUrl: './trip-passages-list.component.pug',
})
export class TripPassagesListComponent {
    @Input()
    public set tripInfo(info: TripInfoWithId) {
        if (info) {
            const passages: ITripPassage[] = [];
            if (info.actual) {
                passages.push(...info.actual);
            }
            if (info.old) {
                passages.push(...info.old);
            }
            passages.sort((a: ITripPassage, b: ITripPassage): number =>
                parseInt(a.stop_seq_num, 10) - parseInt(b.stop_seq_num, 10));
            this.passages = passages;
            return;
        }
        this.passages = [];
    }

    public passages: ITripPassage[] = [];

    /**
     * Returns if the atleast one passages was provided
     * @returns true if there is atleast one departure
     */
    public hasPassages(): boolean {
        return Array.isArray(this.passages) && this.passages.length > 0;
    }

}
