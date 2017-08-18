import {Component, Input, OnChanges} from '@angular/core';

import {FeedbackService} from './feedback.service';

@Component({
    selector: 'feedback',
    templateUrl: './feedback.component.html',
    providers: [FeedbackService],
    styleUrls: ['feedback.component.scss']
})

export class FeedbackComponent implements OnChanges {
    @Input() config: any;
    public canShowModal: boolean = false;
    public hasEnteredFeedback: boolean = false;
    public result: any = {};
    public mouseover: Array<any> = [];

    public responseClass: string;
    public responseMessage: string;

    private feedbackItems: any = {};

    constructor(private service: FeedbackService) {}

    ngOnChanges(): void {
        console.log(this.config);
        this.feedbackItems = this.config.poll;
        for (let i in this.feedbackItems) {
            if (this.feedbackItems.hasOwnProperty(i)) {
                let item: any = this.feedbackItems[i];
                this.result[i] = item.type === 'rating' ? 0 : '';
                this.mouseover[i] = 0;
            }
        }
    }

    public getFeedActive(index: number, value: number): boolean {
        return this.result[index] >= value || this.mouseover[index] >= value;
    }

    public getFeedInActive(index: number, value: number): boolean {
        let max: number = Math.max(this.result[index], this.mouseover[index]);
        return max < value || this.result[index] === undefined;
    }

    public openFeedbackModal(): void {
        this.canShowModal = true;
    }

    public closeFeedbackModal(): void {
        this.canShowModal = false;
        this.result = {};
        this.mouseover = [];
    }

    public clickedRatings(index: number, value: number): void {
        this.result[index] = value;
    }

    public submitFeedback(): void {
        let output: any = {};
        let feedback: Array<any> = [];
        output['request_id'] = this.config.stackId;
        for (let index in this.result) {
            if (this.result.hasOwnProperty(index)) {
                feedback.push({
                    question: this.feedbackItems[index].question,
                    answer: this.result[index]
                });
            }
        }
        output['feedback'] = feedback;
        console.log(output);

        this.service.submit(output).subscribe((response) => {
            this.handleMessage('success');
        }, error => {
            this.handleMessage('error');
        });
    }

    private handleMessage(type: string): void {
        this.hasEnteredFeedback = true;
        switch (type.toLowerCase()) {
            case 'success':
                this.responseClass = 'success-feedback';
                this.responseMessage = 'Thanks for your valuable feedback!';
                break;
            case 'error':
                this.responseClass = 'error-feedback';
                this.responseMessage = 'Something unexpected happened :(';
                break;
            default:
                break;
        }
        setTimeout(() => {
            this.closeFeedbackModal();
        }, 4000);
    }
}
