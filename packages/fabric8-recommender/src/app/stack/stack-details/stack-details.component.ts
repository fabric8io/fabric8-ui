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

    @ViewChild('stackModule') modalStackModule: any;

    public error: any = {};
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


    public feedbackConfig: any = {};

    public tabs: Array<any> = [];

    private userStackInformationArray: Array<UserStackInfoModel> = [];
    private totalManifests: number;

    private stackId: string;

    public tabSelection(tab: any): void {
        tab['active'] = true;
        let currentIndex: number = tab['index'];
        let recommendations: RecommendationsModel = this.recommendationsArray[currentIndex];
        debugger;
        this.stackLevelOutliers = {
            'usage': recommendations.usage_outliers
        };
        this.componentLevelInformation = {
            recommendations: recommendations,
            dependencies: tab.content.user_stack_info.dependencies,
            manifestinfo: tab.content.manifest_name
        };
        this.companionLevelRecommendation = {
            dependencies: recommendations.companion
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
        this.error = error;
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
        this.tabs = [];
        this.recommendationsArray = [];
        // this.dataLoaded = false;
    }

    private init(url: string): void {
        this.stackAnalysisService
            .getStackAnalyses(url)
            .subscribe((data) => {
                this.error = null;
                if (data && (!data.hasOwnProperty('error') && Object.keys(data).length !== 0)) {
                    let resultInformation: Observable<StackReportModel> = getStackReportModel(data);
                    resultInformation.subscribe((response) => {
                        console.log(response);
                        debugger;
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
                            this.recommendationsArray.push(r.recommendations); //Change if the API key changes
                        });

                        this.dataLoaded = true;
                        this.tabSelection(this.tabs[0]);
                    });
                } else {
                    this.handleError({
                        message: data.error,
                        code: data.statusCode,
                        title: 'Please, wait a while more'
                    });
                }
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
                this.handleError({
                    message: error.statusText,
                    code: error.status,
                    title: title
                });
                console.log(this.error);
            });
    }
}
