import { Component } from '@angular/core';

@Component({
    selector: 'overview-stack',
    templateUrl: './overview.html',
    styleUrls: ['./overview.scss']
})
export class OverviewComponent {
    private dependenciesChart: any;
    constructor() {
        this.dependenciesChart = {
            data: {
                columns: [
                    ['data1', 30],
                    ['data2', 120]
                ],
                type : 'donut'
            }
        };
    }
}
