import {Component, Input, OnChanges} from '@angular/core';

@Component({
    selector: 'sentiment',
    templateUrl: './sentiment.component.html',
    styleUrls: ['sentiment.component.scss']
})
export class SentimentComponent implements OnChanges {
    @Input() score: number;
    public metric: any = {};
    public gaugeChart: any = {};

    private threshold: any = {
        start: -0.3,
        end: 0.3
    };

    private sentimentColors: any = {
        'SAD': 'cf2a0e',
        'HAPPY': '368a55',
        'NORMAL': 'bdcf0e'
    };

    ngOnChanges(): void {
        if (this.score) {
            this.metric['feeling'] = this.getStatus(this.score);
        }
    }

    public getSentimentWidth(): string {
        if (this.score === 0) return '50%';
        if (this.score < 0) return (50 - (-1 * this.score * 10 * 5)) + '%';
        return (50 + (this.score * 10 * 5)) + '%';
    }

    public getSentimentBackground(): string {
        return '#' + this.sentimentColors[this.getStatus(this.score)] || '000';
    }

    getStatus(score: any): string {
        score = Number(score);
        if (score < this.threshold['start']) return 'SAD';
        if (score > this.threshold['end']) return 'HAPPY';
        return 'NORMAL';
    }
}
