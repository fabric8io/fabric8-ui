import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { StackAnalysesService } from '../stack-analyses.service';
import { getStackReportModel } from '../utils/stack-api-utils';

import { StackReportModel, ResultInformationModel, UserStackInfoModel,
    RecommendationsModel, ComponentInformationModel } from '../models/stack-report.model';
import { ReportSummaryUtils } from '../utils/report-summary-utils';
import { CommonService } from '../utils/common.service';

@Component({
    selector: 'stack-report-inshort',
    // providers: [StackAnalysesService],
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./stack-report-inshort.component.less'],
    templateUrl: './stack-report-inshort.component.html'
})

export class StackReportInShortComponent implements OnChanges {
    @Input() gatewayConfig: any;
    @Input() stackUrl;
    @Input() repoInfo;
    @Input() buildNumber;
    @Input() appName;
    @Input() pipeline;

    public tabs: Array<any> = [];
    public result: StackReportModel;
    public stackLevel: UserStackInfoModel;
    public recommendations: RecommendationsModel;
    public securityInfo: any;
    public stackLevelOutliers: any;
    public dataLoaded: boolean = false;
    public error: any;
    public progress: any;
    public licenseAnalysis: any;

    private cache: string = '';
    private reportSummaryUtils = new ReportSummaryUtils();

    constructor(private stackAnalysisService: StackAnalysesService, private commonService: CommonService) {}

    ngOnChanges(): void {
        if (this.stackUrl && this.stackUrl !== this.cache) {
            this.cache = this.stackUrl;
            this.dataLoaded = false;
            console.log('inshort component', this.stackUrl, this.gatewayConfig);
            this.stackAnalysisService
                .getStackAnalyses(this.stackUrl, this.gatewayConfig)
                .subscribe((data) => {
                    if (data && (!data.hasOwnProperty('error') && Object.keys(data).length !== 0)) {
                        let resultInformation: Observable<StackReportModel> =
                            getStackReportModel(data);
                        if (resultInformation) {
                            resultInformation.subscribe((response) => {
                                this.result = response;
                                this.buildReportInShort();
                            });
                        }
                    } else if (data && data.hasOwnProperty('error')) {
                        // Handle Errors here 'API error'
                        this.handleProgress({
                            title: 'Analysis for your stack is in progress...'
                        });
                    } else {
                        // Handle Errors here 'API error'
                        this.handleError({
                            title: 'We encountered an unexpected server error',
                            detail: data['error']
                        });
                    }
                }, error => {
                    // Handle server errors here
                    this.handleError({
                        title: 'We encountered an unexpected server error'
                    });
                });
        } else {

        }
    }

    public handleError(error: any): void {
        this.error = error;
        this.dataLoaded = true;
    }

    public handleProgress(data: any): void {
        this.progress = data;
        this.dataLoaded = true;
    }

    public tabSelection(tab: any): void {
        tab['active'] = true;
        let currentIndex: number = tab['index'];
        this.stackLevel = tab.content.user_stack_info;
        this.recommendations = tab.content.recommendation;
        if (this.recommendations) {
            this.stackLevelOutliers = {
                'usage': this.recommendations.usage_outliers
            };
        }
        this.handleLicenseInformation(this.stackLevel);
        this.handleSecurityInformation(this.stackLevel);
    }

    public handleCardClick(cardDetails: any): void {
        this.commonService.shortCardClicked();
    }

    private sortChartColumnData(array: Array<Array<any>>): Array<Array<any>> {
        return array.sort((a, b) => {
            if (a[1] === b[1]) {
                return 0;
            }
            return a[1] > b[1] ? -1 : 1;
        });
    }

    private handleSecurityInformation(tab: UserStackInfoModel): void {
        let dependencies: Array<ComponentInformationModel> = tab.analyzed_dependencies;
        let security: Array<any> = [];
        let temp: Array<any> = [];

        dependencies.forEach((dependency) => {
            security = dependency.security;
            if (security && security.length > 0) {
                let max: any = security.reduce((a, b) => {
                    return parseFloat(a['CVSS']) < parseFloat(b['CVSS']) ? b : a;
                });
                temp.push({
                    name: dependency.name,
                    cve: max
                });
            }
        });
        if (temp.length > 0) {
            let final: any = temp.reduce((a, b) => {
                return parseFloat(a['cve']['CVSS']) < parseFloat(b['cve']['CVSS']) ? b : a;
            });
            let cvssValue: number = final.cve.CVSS;
            let indicator: number;
            let iconClass: string = 'fa fa-shield';
            let displayClass: string = 'progress-bar-warning';

            if (cvssValue < 0) {
                indicator = -1;
            }
            if (cvssValue >= 7.0) {
                indicator = cvssValue;
                iconClass = 'fa fa-shield';
                displayClass = 'progress-bar-danger';
            }
            this.securityInfo = {
                name: final.name,
                cve: final.cve,
                percentage: final.cve.CVSS * 10,
                status: final.cve.CVSS < 7 ? 'moderate' : 'critical',
                iconClass: iconClass,
                displayClass: displayClass
            };
        }
    }

    private handleLicenseInformation(tab: UserStackInfoModel): void {
        this.licenseAnalysis = {
            licenseOutliersCount: 0,
            licenseStackConflictCount: 0,
            licenseComponentConflictCount: 0,
            licenseUnknownCount: 0,
            stackLicenseText: '',
            status: ''
        };

        if (tab.license_analysis) {
          this.licenseAnalysis.licenseOutliersCount =
              tab.license_analysis.outlier_packages ?
                  tab.license_analysis.outlier_packages.length : 0;
          this.licenseAnalysis.licenseStackConflictCount =
              tab.license_analysis.conflict_packages ?
                  tab.license_analysis.conflict_packages.length : 0;
          if (tab.license_analysis.unknown_licenses) {
            this.licenseAnalysis.licenseUnknownCount =
                tab.license_analysis.unknown_licenses.really_unknown ?
                    tab.license_analysis.unknown_licenses.really_unknown.length : 0;
            this.licenseAnalysis.licenseComponentConflictCount =
                tab.license_analysis.unknown_licenses.component_conflict ?
                    tab.license_analysis.unknown_licenses.component_conflict.length : 0;
          }

          this.licenseAnalysis.stackLicenseText = tab.license_analysis.f8a_stack_licenses[0];

          if (tab.license_analysis.status) {
            this.licenseAnalysis.status = tab.license_analysis.status;
          } else {
              this.licenseAnalysis.status = 'nolicensedata';
          }
        }
    }

    private resetFields(): void {
        this.securityInfo = null;
        this.stackLevelOutliers = null;
        this.stackLevel = null;
        this.licenseAnalysis = null;
    }

    private buildReportInShort(): void {
        this.resetFields();
        let resultInformation: Array<ResultInformationModel> = this.result.result;
        if (resultInformation && resultInformation.length > 0) {
            resultInformation.forEach((one: ResultInformationModel, index: number) => {
                let warning: any = this.ifManifestHasWarning(one);
                this.tabs[index] = {
                    title: one.manifest_file_path,
                    content: one,
                    index: index,
                    hasWarning: warning.has,
                    severity: warning.severity
                };
            });
            if (this.tabs[0]) this.tabs[0]['active'] = true;
            this.tabSelection(this.tabs[0]);
            this.dataLoaded = true;
            this.error = null;
        }
    }

    private ifManifestHasWarning(manifest: ResultInformationModel): any {
        let securityInfo = this.reportSummaryUtils.getSecurityReportCard(manifest.user_stack_info);
        let isSecurityWarning = securityInfo.hasWarning;
        let isInsightsWarning = this.reportSummaryUtils.getInsightsReportCard(manifest.recommendation).hasWarning;
        let isLicenseWarning = this.reportSummaryUtils.getLicensesReportCard(manifest.user_stack_info).hasWarning;
        return {
            has: isSecurityWarning || isInsightsWarning || isLicenseWarning,
            severity: (isSecurityWarning && securityInfo.severity) || 2
        };
    }
}
