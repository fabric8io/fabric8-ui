/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
/** Vendor imports Go HERE */

import {
    MComponentFeedback
} from '../../models/ui.model';

import { ComponentFeedbackService } from './component-feedback.service';

@Component({
    selector: 'component-feedback',
    styleUrls: ['./component-feedback.component.less'],
    providers: [ComponentFeedbackService],
    templateUrl: './component-feedback.component.html'
})
export class ComponentFeedbackComponent implements OnChanges {
    @Input() feedback: MComponentFeedback;

    constructor(private feedbackService: ComponentFeedbackService) {}

    public handleFeedback(event: MouseEvent, type: boolean): void {
        event.stopPropagation();
        debugger;
        if (this.feedback) {
            this.feedback.feedback_type = type;
            let subscription = this.feedbackService.postFeedback(this.feedback);
            if (subscription) {
                subscription.subscribe((result) => {
                    console.log(result);
                });
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        debugger;
        let summary: any = changes['feedback'];
        if (summary) {
            this.feedback = <MComponentFeedback> summary.currentValue;
        }
    }
}
