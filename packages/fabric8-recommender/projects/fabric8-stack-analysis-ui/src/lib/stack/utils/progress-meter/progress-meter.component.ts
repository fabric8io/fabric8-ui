/** Vendor imports Go HERE */
import { Component, Input } from '@angular/core';
/** Vendor imports Go HERE */

import { MProgressMeter } from '../../models/ui.model';

@Component({
    selector: 'ana-progress-meter',
    styleUrls: ['./progress-meter.component.less'],
    templateUrl: './progress-meter.component.html'
})
export class ProgressMeterComponent {
    @Input() config: MProgressMeter;
}
