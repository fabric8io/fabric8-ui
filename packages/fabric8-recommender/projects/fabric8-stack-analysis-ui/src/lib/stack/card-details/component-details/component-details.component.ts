/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
/** Vendor imports Go HERE */

import {
    MComponentDetails,
    MComponentHeaderColumn,
    MGenericStackInformation
} from '../../models/ui.model';

@Component({
    selector: 'component-details',
    styleUrls: ['./component-details.component.less'],
    templateUrl: './component-details.component.html'
})
export class ComponentDetailsComponent implements OnChanges {
    @Input() compDetails: MComponentDetails;
    @Input() positions: Array<MComponentHeaderColumn>;
    @Input() type: string;
    @Input() serial: number;
    @Input() genericInformation: MGenericStackInformation;
    @Input() repoInfo: any;

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['compDetails'];
        if (summary) {
            this.compDetails = <MComponentDetails> summary.currentValue;
        }
        if (changes['positions']) {
            this.positions = changes['positions']['currentValue'];
        }
    }
}
