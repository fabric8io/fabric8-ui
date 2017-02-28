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
                    ['internal', 11],
                    ['external', 21]
                ],
                type: 'donut'
            },
            chartOptions: {
                donut: {
                    width: 50,
                    title: '32 Dependencies'
                },
                color: {
                    pattern: ['#696969', '#A9A9A9']
                }
            },
            configs: {
                legend: {
                    position: 'right'
                }
            }
        };
    }
}
