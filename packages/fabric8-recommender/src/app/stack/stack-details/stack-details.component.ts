import {Component, Input, OnChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {StackAnalysesService} from '../stack-analyses.service';
import {getStackReportModel} from '../utils/stack-api-utils';
import {StackReportModel, ResultInformationModel, UserStackInfoModel, ComponentInformationModel, RecommendationsModel} from '../models/stack-report.model';

@Component({
    selector: 'stack-details',
    templateUrl: './stack-details.component.html',
    providers: [StackAnalysesService],
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['stack-details.component.scss']
})

export class StackDetailsComponent implements OnChanges {
    @Input() stack: string;
    @Input() displayName;
    @Input() repoInfo;
    @Input() buildNumber;
    @Input() appName;
    @Input() stackResponse;

    @ViewChild('stackModule') modalStackModule: any;

    public errorMessage: any = {};
    public modalHeader: string = null;
    public userStackInformation: UserStackInfoModel;
    public componentLevelInformation: any = {};
    public userComponentInformation: Array<ComponentInformationModel> = [];
    public companionLevelRecommendation: any = {};
    public dataLoaded: boolean = false;
    public recommendationsArray: Array<RecommendationsModel> = [];
    public stackLevelOutliers: any = {};

    public companionLevel: any = {};
    public componentLevel: any = {};

    public componentFilterBy: string = '';
    public customClass: string = 'customClass';
    public analysis: any = {};


    public feedbackConfig: any = {};

    public tabs: Array<any> = [];

    private userStackInformationArray: Array<UserStackInfoModel> = [];
    private totalManifests: number;

    private stackId: string;

    public showStackModal(event: Event): void {
        event.preventDefault();
        this.modalStackModule.open();
    }

    /**
     * Gets triggered on close of modal,
     * Clears the existing states to make it proper on open
     */
    public handleModalClose(): void {
        this.resetFields();
    }

    public tabSelection(tab: any): void {
        tab['active'] = true;
        let currentIndex: number = tab['index'];
        let recommendations: RecommendationsModel = this.recommendationsArray[currentIndex];
        if (recommendations) {
            this.stackLevelOutliers = {
                'usage': recommendations.usage_outliers
            };
            this.companionLevelRecommendation = {
                dependencies: recommendations.companion
            };
        }
        let total: number = 0;
        let analyzed: number = 0;
        let unknown: number = 0;

        if (tab.content && tab.content.user_stack_info) {
            let userStackInfo: UserStackInfoModel = tab.content.user_stack_info;
            if (userStackInfo.dependencies) {
                total = tab.content.user_stack_info.dependencies.length;
            }
            analyzed = userStackInfo.analyzed_dependencies_count;
            unknown = userStackInfo.unknown_dependencies_count;
        }

        this.analysis = {
            stackLevel: `Total: {{total}} | Analyzed: {{analyzed}} | Unknown: {{unknown}}`,
            alternate: '[12 alternate components match your stack composition and may be more appropriate]',
            companion: '[6 additional components are often used by similar stacks]'
        };
        this.componentLevelInformation = {
            recommendations: recommendations,
            dependencies: tab.content.user_stack_info.dependencies,
            manifestinfo: tab.content.manifest_name
        };
    }

    ngOnChanges(): void {
        this.resetFields();
        this.stackId = this.stack && this.stack.split('/')[this.stack.split('/').length - 1];
        // this.init(this.stack);
        this.initFeedback();
        this.componentLevel = {
            header: 'Analysis of your application stack',
            subHeader: 'Recommended alternative dependencies'
        };
        this.companionLevel = {
            header: 'Possible companion dependencies',
            subHeader: 'Consider theses additional dependencies'
        };
        this.modalStackModule.open();
    }

    public handleChangeFilter(filterBy: any): void {
        this.componentFilterBy = filterBy.filterBy;
    }

    constructor(private stackAnalysisService: StackAnalysesService) {}

    private handleError(error: any): void {
        this.errorMessage = error;
        this.modalHeader = error.title;
    }

    private initFeedback(): void {
        this.feedbackConfig = {
            name: 'Feedback',
            stackId: this.stackId,
            title: 'Tell us your experience',
            poll: [{
                question: 'How useful do you find this?',
                type: 'rating'
            }, {
                question: 'How likely do you recommend this to others?',
                type: 'rating'
            }, {
                question: 'Tell us more',
                type: 'text'
            }]
        };
    }

    private resetFields(): void {
        console.log('Reset');
        console.log(this.tabs);
        this.tabs.length = 0;
        this.dataLoaded = false;
        this.errorMessage = null;
        this.recommendationsArray = [];
        this.stackLevelOutliers = {};
        this.componentLevelInformation = {};
        this.companionLevelRecommendation = {};
        // this.dataLoaded = false;
    }

    private handleResponse(data: any): void {
        this.errorMessage = null;
        this.tabs = [];
        if (data && (!data.hasOwnProperty('error') && Object.keys(data).length !== 0)) {
            let resultInformation: Observable<StackReportModel> = getStackReportModel(data);
            resultInformation.subscribe((response) => {
                console.log(response);
                let result: Array<ResultInformationModel> = response.result;
                this.totalManifests = result.length;
                this.userStackInformationArray = result.map((r) => r.user_stack_info);
                result.forEach((r, index) => {
                    console.log('HEre');
                    this.tabs.push({
                        title: r.manifest_file_path,
                        content: r,
                        index: index
                    });
                    this.recommendationsArray.push(r.recommendation);
                });
                this.modalHeader = 'Updated just now';
                this.dataLoaded = true;
                this.tabSelection(this.tabs[0]);
            });
        } else {
            this.handleError({
                message: data.error,
                code: data.statusCode,
                title: 'Updating ...'
            });
        }
    }

    private init(): void {
        if (this.stackResponse) {
            // Change this to some other logic
            setTimeout(() => {
                this.handleResponse(this.stackResponse);
            }, 1000);
        } else {
            if (this.stack && this.stack !== '') {
                this.stackAnalysisService
                    .getStackAnalyses(this.stack)
                    .subscribe((data) => {
                        this.handleResponse(data);
                    },
                    error => {
                        // this.handleError(error);
                        console.log(error);
                        let title: string = '';
                        if (error.status >= 500) {
                            title = 'Something unexpected happened';
                        } else if (error.status === 404) {
                            title = 'You are looking for something which isn\'t there';
                        } else if (error.status === 401) {
                            title = 'You don\'t seem to have sufficient privileges to access this';
                        }
                        title = 'Report failed ...'; // Check if just this message is enough.
                        this.handleError({
                            message: error.statusText,
                            status: error.status,
                            title: title
                        });
                        console.log(this.errorMessage);
                    });
            }
        }
    }
}
