/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
/** Vendor imports Go HERE */

import {
    MComponentInformation
} from '../../../models/ui.model';

@Component({
    selector: 'component-snippet',
    styleUrls: ['./component-snippet.component.less'],
    templateUrl: './component-snippet.component.html'
})
export class ComponentSnippetComponent implements OnChanges {
    @Input() component: MComponentInformation;
    @Input() view: string;

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['component'];
        if (summary) {
            this.component = <MComponentInformation> summary.currentValue;
        }
    }
}
