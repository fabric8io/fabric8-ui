/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
/** Vendor imports Go HERE */

import {
    MReportInformation,
    MComponentDetails
} from '../../models/ui.model';

@Component({
    selector: 'report-information',
    styleUrls: ['./report-information.component.less'],
    templateUrl: './report-information.component.html'
})
export class ReportInformationComponent implements OnInit, OnChanges {
    @Input() report: MReportInformation;
    public componentDetails: Array<MComponentDetails> = null;

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['report'];
        if (summary) {
            this.report = <MReportInformation> summary.currentValue;
            this.paint();
        }
    }

    public handleAccordion(componentDetail: MComponentDetails): void {
        this.closeAllButThis(componentDetail);
        if (componentDetail.componentInformation) {
            componentDetail.componentInformation.isOpen = !componentDetail.componentInformation.isOpen;
        }
        if (componentDetail.recommendationInformation) {
            if (componentDetail.recommendationInformation.componentInformation) {
                componentDetail.recommendationInformation.componentInformation.isOpen = !componentDetail.recommendationInformation.componentInformation.isOpen;
            }
        }
    }

    private paint(): void {
        if (this.report) {
            if (this.report.componentDetails && this.report.componentDetails.length > 0) {
                this.componentDetails = this.report.componentDetails;
            }
        }
    }

    private closeAllButThis(componentDetail: MComponentDetails): void {
        if (this.componentDetails) {
            this.componentDetails.forEach((cdetail: MComponentDetails) => {
                if (cdetail !== componentDetail) {
                    if (cdetail.componentInformation) {
                        cdetail.componentInformation.isOpen = false;
                    }
                    if (cdetail.recommendationInformation) {
                        if (cdetail.recommendationInformation.componentInformation) {
                            cdetail.recommendationInformation.componentInformation.isOpen = false;
                        }
                    }
                }
            });
        }
    }
}
