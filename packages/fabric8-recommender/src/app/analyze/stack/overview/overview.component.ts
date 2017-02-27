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
                type: 'donut'
            },
            chartOptions: {
                donut: {
                    width: 50
                },
                color: {
                    pattern: ['#696969', '#A9A9A9']
                }
            },
            configs: {
                legend: {
                    position: 'inset',
                    inset: {
                        anchor: 'top-right',
                        x: 70,
                        y: 120,
                        step: 2
                    }
                }
            }
        };
    }
}
