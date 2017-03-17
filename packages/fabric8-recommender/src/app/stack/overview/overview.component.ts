import { Component, Input, OnInit } from '@angular/core';
import { GlobalConstants } from '../constants/constants.service';

@Component({
    selector: 'overview-stack',
    templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
    @Input() stackOverviewData;
    private cveDataList: any;
    private messages: any;

    constructor(private constants: GlobalConstants) {
        this.constants.getMessages('overview').subscribe((message) => {
            this.messages = message;
        });
    }

    ngOnInit() {
        this.initOverviewComponents(this.stackOverviewData);
    }

    private initOverviewComponents(stackOverviewData: any): void {
        if (stackOverviewData) {
            this.cveDataList = stackOverviewData.CVEdata;
        }
    }
}

