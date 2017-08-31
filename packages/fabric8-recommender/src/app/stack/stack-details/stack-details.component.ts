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
    styleUrls: ['./stack-details.component.scss'],
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
    public cache: string = '';
    public cacheResponse: any;
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
    public customClass: string = 'accordion-custom';
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
        let alternate: number = 0, companion: number = 0;
        if (recommendations) {
            this.stackLevelOutliers = {
                'usage': recommendations.usage_outliers
            };
            this.companionLevelRecommendation = {
                dependencies: recommendations.companion
            };
            alternate = recommendations.alternate ? recommendations.alternate.length : 0;
            companion = recommendations.companion ? recommendations.companion.length : 0;
        }
        let total: number = 0;
        let analyzed: number = 0;
        let unknown: number = 0;

        if (tab.content && tab.content.user_stack_info) {
            let userStackInfo: UserStackInfoModel = tab.content.user_stack_info;
            if (userStackInfo.dependencies) {
                analyzed = tab.content.user_stack_info.dependencies.length;
            }
            if (userStackInfo.analyzed_dependencies) {
                total = userStackInfo.analyzed_dependencies.length;
            }
            if (userStackInfo.unknown_dependencies) {
                unknown = userStackInfo.unknown_dependencies.length;
            }
        }

        this.analysis = {
            stackLevel: 'Total: ' +  total + ' | Analyzed: ' + analyzed + ' | Unknown: ' + unknown,
            alternate: '[' + alternate + ' alternate components match your stack composition and may be more appropriate]',
            companion: '[' + companion + ' additional components are often used by similar stacks]'
        };
        this.componentLevelInformation = {
            recommendations: recommendations,
            dependencies: tab.content.user_stack_info.dependencies,
            manifestinfo: tab.content.manifest_name
        };
    }

    ngOnChanges(): void {
        if (this.stack && this.stack !== this.cache) {
            this.cache = this.stack;
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
        this.displayName = this.displayName || 'Stack Report';
        }
    }

    public handleChangeFilter(filterBy: any): void {
        this.componentFilterBy = filterBy.filterBy;
    }

    constructor(private stackAnalysisService: StackAnalysesService) {}

    private handleError(error: any): void {
        this.errorMessage = error;
        this.modalHeader = error.title;
        this.dataLoaded = true;
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
        this.tabs.length = 0;
        this.dataLoaded = false;
        this.errorMessage = null;
        this.recommendationsArray = [];
        this.stackLevelOutliers = {};
        this.componentLevelInformation = {};
        this.companionLevelRecommendation = {};
        this.cacheResponse = {};
        // this.dataLoaded = false;
    }

    private handleResponse(data: any): void {
        this.errorMessage = null;
        this.tabs = [];
        if (data && (!data.hasOwnProperty('error') && Object.keys(data).length !== 0)) {
            let resultInformation: Observable<StackReportModel> = getStackReportModel(data);
            resultInformation.subscribe((response) => {
                let result: Array<ResultInformationModel> = response.result;
                this.totalManifests = result.length;
                this.userStackInformationArray = result.map((r) => r.user_stack_info);
                result.forEach((r, index) => {
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
        if (this.stackResponse && this.cacheResponse !== this.stackResponse) {
            this.cacheResponse = this.stackResponse;
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
                    });
            }
        }
    }
}
