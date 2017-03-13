import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'overview-stack',
    templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {
    @Input() stackOverviewData;
    private cveDataList: any;

    constructor() { }

    ngOnInit() {
        this.initOverviewComponents(this.stackOverviewData);
    }

    private initOverviewComponents(stackOverviewData: any): void {
        if (stackOverviewData) {
            this.cveDataList = stackOverviewData.CVEdata;
        }
    }
}

