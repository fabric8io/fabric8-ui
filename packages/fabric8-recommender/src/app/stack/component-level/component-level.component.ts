import {Component, Input, OnChanges} from '@angular/core';


import { Observable } from 'rxjs/Observable';
import { Space, Contexts } from 'ngx-fabric8-wit';

import { ComponentInformationModel, RecommendationsModel, OutlierInformationModel, StackLicenseAnalysisModel } from '../models/stack-report.model';
import { AddWorkFlowService } from '../stack-details/add-work-flow.service';

@Component({
    selector: 'component-level-information',
    styleUrls: ['./component-level.component.less'],
    providers: [AddWorkFlowService],
    templateUrl: './component-level.component.html'
})

export class ComponentLevelComponent implements OnChanges {

    @Input() component: any;
    @Input() isCompanion: boolean;
    @Input() filterBy: string;
    @Input() config: any;

    @Input() header: string;
    @Input() subHeader: string;

    @Input() data;

    public workItemResponse: Array<any> = [];
    public dependencies: Array<ComponentInformationModel> = [];
    public recommendations: RecommendationsModel;
    public messages: any;
    public angleDown: string = 'fa-angle-down';
    public sortDirectionClass: string = this.angleDown;
    public licenseAnalysis: StackLicenseAnalysisModel;

    private dependenciesList: Array<any> = [];
    private headers: Array<any> = [];
    private keys: any = [];
    private alternate: Array<ComponentInformationModel> = [];
    private usageOutliers: Array<OutlierInformationModel> = [];

    private fieldName: string;
    private fieldValue: string;

    private filters: Array<any> = [];
    private currentFilter: string = '';

    private orderByName: string = '';
    private direction: string = '';
    private angleUp: string = 'fa-angle-up';

    private spaceName: string;
    private userName: string;


    constructor(
        private addWorkFlowService: AddWorkFlowService,
        private context: Contexts
    ) {
        this.messages = {
            'title': 'Recommendations',
            'sub_title': {
                'firstPart': 'Based on our analytics engine we found ',
                'secondPart': ' recommendations to improve your application stack:'
            },
            'create_work_item': 'Create Work Item',
            'create_work_items': 'Create Work Items',
            'view_work_item': 'View Work Item',
            'select_all_text': 'Select All',
            'no_recommendations_text': 'No recommendations.',
            'no_recommendations_suggestion': ' For your stack there are currently no recommendations. Below is some general information about it.',
            'toastDisplay': {
                'text1': 'Workitem with ID ',
                'text2': ' has been added to the backlog.'
            },
            'create_work_item_error': 'There was a error while creating work item.',
            'default_stack_name': 'An existing stack',
            'license': {
                'really_unknown': 'Some licenses are unknown',
                'license_conflict_in_component': 'Some licenses in this component are conflicting with each other'
            }
        };
        if (this.context && this.context.current) {
            this.context.current.subscribe(val => {
                this.spaceName = val.name;
                this.userName = val.user.attributes.username;
            });
        }

        this.keys = {
            name: 'name',
            currentVersion: 'curret_version',
            latestVersion: 'latest_version',
            cveid: 'cveid',
            cvss: 'cvss',
            license: 'license',
            linesOfCode: 'linesOfCode',
            avgCycloComplexity: 'avgCycloComplexity',
            noOfFiles: 'noOfFiles',
            dateAdded: 'dateAdded',
            publicPopularity: 'pubPopularity',
            enterpriseUsage: 'enterpriseUsage',
            teamUsage: 'teamUsage'
        };

        this.filters = [{
            name: 'All',
            identifier: 'reset'
        }, {
            name: 'Usage Outliers',
            identifier: 'isUsageOutlier',
            class: 'fa usage-outlier filter-icon'
        }, {
            name: 'Security Issues',
            identifier: 'has_issue',
            class: 'fa insecure fa-ban'
        }, {
            name: 'Alternate Components',
            identifier: 'isChild',
            class: 'fa fa-database child-icon alternate-component-icon'
        }, {
            name: 'Grouped Components',
            identifier: 'isGrouped',
            class: 'fa fa-database child-icon alternate-component-icon'
        }, {
            name: 'License Outliers',
            identifier: 'isLicenseOutlier',
            class: 'fa outlier-icon'
        }, {
            name: 'Unknown Licenses',
            identifier: 'isUnknownLicense',
            class: 'fa unknown-license'
        }, {
            name: 'License conflict in a Component',
            identifier: 'isLicenseConflictInComponent',
            class: 'fa conflict-license'
        }];

        this.currentFilter = this.filters[0].name;
    }

    /**
     * handleKeyUpEvent - takes an event and returns nothing
     * 
     * Gets triggered everytime a value is typed in the filter box
     * Sets the received value to the fieldValue
     */
    public handleKeyUpEvent(event: Event): void {
        let target: any = event.target;
        this.fieldValue = target.value;
    }

    /**
     * Handles the click after changing the filters.
     */
    public handleDropDownClick(element: Element): void {
        if (element.classList.contains('open')) {
            element.classList.remove('open');
        } else {
            element.classList.add('open');
        }
    }

    public handleCollapseClick(event: Event): void {
        let target: any = event.target;
        if (target.classList.contains('parent-icon')) {
            let parent: HTMLElement = target.parentNode.parentNode;
            let id: string = parent.id;
            if (target.classList.contains('collapsed')) {
                target.classList.remove('collapsed');
                this.toggleEntries(id, true);
            } else {
                target.classList.add('collapsed');
                this.toggleEntries(id, false);
            }
        }
    }

    public handleFilterFieldClick(element: Element, field: any, event: Event): void {
        event.stopPropagation();
        this.currentFilter = field.name;
        this.fieldName = field.identifier;
        if (element.classList.contains('open')) {
            element.classList.remove('open');
        } else {
            element.classList.add('open');
        }
        event.preventDefault();
    }

    /*
     *  handleCreateWorkItemAction - takes recommendation and returns nothing
     *  Creates work items in specified format to be consumed for POST request
     */
    public handleCreateWIclick(recommender: any, event: Event): void {
        let workItems = [];
        let message: string = '';
        let codebaseobj: any = {
            codebase: {
              'repository': 'Test_Repo',
              'branch': 'task-1234',
              'filename': this.component['manifestinfo'],
              'linenumber': 1
            }
        };

        // TODO form data to be shared with recommender object
        let titleHdr: string = '';
        if (recommender && recommender.hasOwnProperty('isChild') && recommender['isChild']) {
            message = `Stack analysis has identified alternate components for **${recommender.parentName}**.
            You have chosen to replace **${recommender.parentName}** with **${recommender.name}** and version: **${recommender.recommended_version}** in your application stack`;
            titleHdr = `Alternate components for ${recommender.parentName}`;
        } else {
            message = `Stack analysis has identified some additional components for your application stack.
            You have chosen to add **${recommender.name}** with **${recommender.recommended_version}** to your application stack`;
            titleHdr = `Add ${recommender.name} to your application stack`;
        }
        let description: string = message;
        let codebase: any = codebaseobj;
        if (this.data && this.data.git) {
            codebase['repository'] = this.data.git.uri || '';
            codebase['branch'] = this.data.git.ref || 'master';
        }
        description += ' \n\n ';
        description += '\n\n **Repository:** ' + codebase['repository'];
        description += '\n\n **Branch:** ' + codebase['branch'];
        description += '\n\n **Filename:** ' + codebase['codebase']['filename'];
        description += '\n\n **Line Number:**' + codebase['codebase']['linenumber'];
        let item: any = {
            title: titleHdr,
            description: description,
            markup: 'Markdown',
            codebase: codebase,
            key: recommender['name']
        };

        workItems.push(item);

        if (workItems.length > 0) {
            this.addWorkItems(workItems[0]);
        } else {
            console.log('Work items are empty and cannot be added');
        }
    }

    /**
     * Handles the column header click.
     * This changes the tables entries either to ascending order or
     * desending order in context to the field
     */
    public handleTableOrderClick(header: any): void {
        if (header.isSortable) {
            this.orderByName = header.identifier;
            if (!header.direction || header.direction.toLowerCase() === 'down') {
                header.direction = 'up';
                header.sortDirectionClass = this.angleUp;
            } else {
                header.direction = 'down';
                header.sortDirectionClass = this.angleDown;
            }
            this.direction = header.direction;
        }
    }

    isNormalLicense(dependency) {
        if (dependency.license_analysis &&
            dependency.license_analysis.licensestatus &&
            (dependency.license_analysis.licensestatus.toLowerCase() === 'outlier' ||
            dependency.license_analysis.licensestatus.toLowerCase() === 'reallyunknown' ||
            dependency.license_analysis.licensestatus.toLowerCase() === 'licenseconflict')) {
            return false;
        }
        return true;
    }

    isOutliedLicense(dependency: any, licenseToCheck: string): boolean {
        if (dependency.license_analysis.outliedLicense === licenseToCheck) {
            return true;
        }
        return false;
    }

    isUnknownLicense(dependency: any, licenseToCheck: string): boolean {
        if (dependency.license_analysis.unknownLicense === licenseToCheck) {
            return true;
        }
        return false;
    }

    isConflictLicense(dependency: any, licenseToCheck: string): boolean {
        if (dependency.license_analysis.conflictingLicenses[0]['license1'] === licenseToCheck ||
            dependency.license_analysis.conflictingLicenses[0]['license2'] === licenseToCheck) {
            return true;
        }
        return false;
    }

    ngOnChanges(): void {
        if (this.component) {
            if (this.isCompanion === undefined) {
                this.dependencies = this.component['dependencies'];
                this.recommendations = this.component['recommendations'];
                if (this.recommendations) {
                    this.alternate = this.recommendations.alternate;
                    this.usageOutliers = this.recommendations['usage_outliers'];
                }
            } else {
                this.dependencies = this.component['dependencies'];
            }
            this.licenseAnalysis = this.component['licenseAnalysis'];
            this.handleDependencies(this.dependencies);
        }
        if (this.filterBy) {
            this.fieldName = this.filterBy;
            this.currentFilter = this.filters.filter((f) => f.identifier === this.fieldName)[0].name;
        }
    }

    private toggleEntries(id: string, isCollapsed: boolean): void {
        let rows = document.getElementsByClassName(id);
        let len: number = rows.length;
        if (isCollapsed) {
            for (let i: number = 0; i < len; ++ i) {
                if (rows[i].classList.contains('collapse'))
                    rows[i].classList.remove('collapse');
            }
        } else {
            for (let i: number = 0; i < len; ++ i) {
                rows[i].classList.add('collapse');
            }
        }
    }

    private handleDependencies(dependencies: Array<ComponentInformationModel>): void {
        if (dependencies) {
            let length: number = dependencies.length;
            let dependency: any, eachOne: ComponentInformationModel;
            this.headers = [
                {
                    name: 'Package name',
                    class: 'medium',
                    order: 1
                }, {
                    name: 'Current Version',
                    class: 'small',
                    order: 2
                }, {
                    name: 'Recommended Version',
                    class: 'small',
                    order: 3
                }, {
                    name: 'Latest Version',
                    class: 'small',
                    order: 4
                }, {
                    name: 'Security Issue',
                    class: 'small',
                    order: 5
                }, {
                    name: 'License',
                    class: 'medium',
                    order: 6
                }, {
                    name: 'OSIO Usage',
                    class: 'small',
                    order: 7
                }, {
                   name: 'Github Statistics',
                   class: 'small',
                   order: 8
                }, {
                    name: 'Github Dependants',
                    class: 'large',
                    order: 9
                }, {
                    name: 'Categories',
                    class: 'medium',
                    order: 10
                }, {
                     name: 'Action',
                     class: 'small'
                 }
            ];

            if (this.isCompanion) {
                this.headers.splice(2, 1);
            }

            this.dependenciesList = [];
            let linesOfCode: any = '';
            let noOfFiles: any = '';
            let tempLen: number;
            for (let i: number = 0; i < length; ++i) {
                eachOne = dependencies[i];
                dependency = this.setParams(eachOne, this.isCompanion !== undefined);
                dependency['isUsageOutlier'] = this.isUsageOutlier(dependency['name']);
                dependency['compId'] = 'comp-' + i;
                if (this.licenseAnalysis.status.toLowerCase() === 'successful' && this.licenseAnalysis.outlier_packages.length) {
                    dependency = this.checkIfOutlierPackage(dependency);
                }
                if ((this.licenseAnalysis.status.toLowerCase() === 'unknown' || this.licenseAnalysis.status.toLowerCase() === 'componentconflict') && this.licenseAnalysis.unknown_licenses) {
                    if (this.licenseAnalysis.unknown_licenses.really_unknown.length) {
                        dependency = this.checkIfReallyUnknownLicense(dependency);
                    }
                    if (this.licenseAnalysis.unknown_licenses.component_conflict.length) {
                        dependency = this.checkIfLicenseConflictInAComponent(dependency);
                    }
                }
                this.dependenciesList.push(dependency);
                tempLen = this.dependenciesList.length;
                if (this.alternate) {
                    this.checkAlternate(eachOne['name'], eachOne['version'], this.dependenciesList, dependency['compId'], dependency['name']);
                    if (tempLen !== this.dependenciesList.length) {
                        dependency['isParent'] = true;
                        dependency['isGrouped'] = true;
                    }
                }
            }
        }
    }

    private setParams(input: any, canCreateWorkItem: boolean) {
        let output: any = {};
        let github: any = input['github'] || {};
        output['name'] = input['name'];
        output['current_version'] = input['version'];
        if (canCreateWorkItem) {
            output['current_version'] = '';
            output['recommended_version'] = input['version'];
        } else {
            output['recommended_version'] = '';
        }
        output['recommended_version'] = this.putNA(output['recommended_version']);
        output['current_version'] = this.putNA(output['current_version']);
        output['latest_version'] = this.putNA(input['latest_version']);
        output['licenses'] =
            input['licenses'] && input['licenses'].length ? input['licenses'] : '-';
        output['licenseCount'] = output['licenses'] ? output['licenses'].length : 0;
        output['license_analysis'] = input['license_analysis'];
        output['sentiment_score'] = input['sentiment'] && input['sentiment']['overall_score'];
        output['github_user_count'] = input['github'] && input['github']['dependent_repos'];
        output['github_user_count'] = this.putNA(output['github_user_count']);
        output['osio_user_count'] = input['osio_user_count'];
        output['watchers'] = this.putNA(github['watchers']);
        output['stargazers_count'] = this.putNA(github['stargazers_count']);
        output['total_releases'] = this.putNA(github['total_releases']);
        output['forks_count'] = this.putNA(github['forks_count']);
        output['contributors'] = this.putNA(github['contributors']);
        output['git_stat'] = (output['github_user_count'] > -1 || output['watchers'] > -1 || output['stargazers_count'] > -1 || output['total_releases'] > -1 || output['forks_count'] > -1 || output['contributors'] > -1);
        output['has_issue'] = input['security'].length > 0;
        output['security_issue'] = output['has_issue'] ? Math.max.apply(Math, input['security'].map(d => d.CVSS)) : '';
        output['used_by'] = github['used_by'];
        output['categories'] = input['topic_list'];
        output['categories'] = (output['categories'] && output['categories'].length > 0 && output['categories'].join(', ')) || '';
        output['action'] = canCreateWorkItem ? 'Create Work Item' : '';
        return output;
    }

    private checkIfOutlierPackage(dependency: any): any {
        dependency['isLicenseOutlier'] = false;
        this.licenseAnalysis.outlier_packages.forEach((item, index) => {
            if (dependency.name.toLocaleLowerCase() === item.package.toLocaleLowerCase()) {
                dependency['isLicenseOutlier'] = true;
                dependency['license_analysis'] = {
                    'licensestatus': 'outlier',
                    'outliedLicense': item.license
                };
            }
        });
        return dependency;
    }

    private checkIfReallyUnknownLicense(dependency: any): any {
        dependency['isUnknownLicense'] = false;
        this.licenseAnalysis.unknown_licenses.really_unknown.forEach((item, index) => {
            if (item.package.toLocaleLowerCase() === dependency.name.toLocaleLowerCase()) {
                dependency['isUnknownLicense'] = true;
                dependency['license_analysis'] = {
                    'licensestatus': 'reallyunknown',
                    'unknownLicense': item.license
                };
            }
        });
        return dependency;
    }

    private checkIfLicenseConflictInAComponent(dependency: any): any {
        dependency['isLicenseConflictInComponent'] = false;
        this.licenseAnalysis.unknown_licenses.component_conflict.forEach((item, index) => {
            if (item.package.toLocaleLowerCase() === dependency.name.toLocaleLowerCase()) {
                dependency['isLicenseConflictInComponent'] = true;
                dependency['license_analysis'] = {
                    'licensestatus': 'licenseconflict',
                    'conflictingLicenses': item.conflict_licenses
                };
            }
        });
        return dependency;
    }

    private putNA(count: any): any {
        return !count || count < 0 ? '-' : count;
    }

    private checkAlternate (name: string, version: string, list: Array<any>, parentId: string, parentName: string) {
        if (this.alternate && this.alternate.length > 0) {
            let recom: Array<ComponentInformationModel> = this.alternate.filter((a) => a.replaces[0].name === name && a.replaces[0].version === version);
            recom.forEach(r => {
                let obj: any = this.setParams(r, true);
                obj['isChild'] = true;
                obj['parent-reference'] = parentId;
                obj['isGrouped'] = true;
                obj['parentName'] = parentName;
                list.push(obj);
            });
        }
    }

    private isUsageOutlier(packageName: string): boolean {
        if (this.usageOutliers && this.usageOutliers.length > 0) {
            let result: Array<OutlierInformationModel> = this.usageOutliers.filter(u => u.package_name === packageName);
            return result && result.length > 0;
        }
    }

     /*
     *  getWorkItemData - Takes nothing, returns Object
     *  It returns the predefined JSON structure to be sent as an input
     *  for work item creation request.
     */
    private getWorkItemData(): any {
        let workItemData = {
            'data': {
                'attributes': {
                    'system.state': 'open',
                    'system.title': '',
                    'system.codebase': ''
                },
                'type': 'workitems',
                'relationships': {
                    'baseType': {
                        'data': {
                            'id': '26787039-b68f-4e28-8814-c2f93be1ef4e',
                            'type': 'workitemtypes'
                        }
                    }
                }
            }
        };
        return workItemData;
    }

    /*
     *  addWorkItems - takes workitems array, return nothing
     *  A generic function that recieves workitems in a predefined format
     *  Creates work items based on the data
     *  Handles single as well as multiple work items 
     */
    private addWorkItems(workItem: Array<any>): void {
        //let length: number = workItems.length;
        let newItem: any; //, workItem: any;
        newItem = this.getWorkItemData();
        //for (let i: number = 0; i < length; ++i) {
            //if (workItems[i]) {
                //workItem = workItems[i];
                // TODO: Handle the case of sending multiple work items concurrently
                // once the API Payload is properly set at the receiving end.
                if (newItem) {
                    newItem.data.attributes['system.title'] = workItem['title'];
                    newItem.data.attributes['system.description'] = workItem['description'];
                    newItem.data.attributes['system.codebase'] = workItem['codebase'];
                    newItem.data.attributes['system.description.markup'] = workItem['markup'];
                    newItem.key = workItem['key'];
                }
           // }
        //}

        let workFlow: Observable<any> = this.addWorkFlowService.addWorkFlow(newItem);
        workFlow.subscribe((data) => {
            if (data) {
                let inputUrlArr: Array<string> = [];
                if (data.links && data.links.self && data.links.self.length && data.data.attributes) {
                    inputUrlArr = data.links.self.split('/api/');
                    let hostString = inputUrlArr[0] ? inputUrlArr[0].replace('api.', '') : '';
                    let baseUrl: string = hostString +
                        `/${this.userName}/${this.spaceName}/plan/detail/` + data.data.attributes["system.number"];
                    this.displayWorkItemResponse(baseUrl, data.data.attributes["system.number"]);
                    newItem.url = baseUrl;
                    //TODO :: toggle Worke item link and toast notification
                    //this.toggleWorkItemButton(newItem);
                }
            }
        });
    }

     /**
     * displayWorkItemResponse - takes a message string and returns nothing
     * Displays the response received from the creation of work items
     */
    private displayWorkItemResponse(url: string, id: any): void {
        let notification = {
            iconClass: '',
            alertClass: '',
            text: null,
            link: null,
            linkText: this.messages.view_work_item
        };
        if (id) {
            notification.iconClass = 'pficon-ok';
            notification.alertClass = 'alert-success';
            notification.text = this.messages.toastDisplay.text1 +
                id + this.messages.toastDisplay.text2;
            notification.link = url;
        } else {
            notification.iconClass = 'pficon-error-circle-o';
            notification.alertClass = 'alert-danger';
            notification.text = this.messages.create_work_item_error;
        }
        this.workItemResponse.push(notification);
    }



}
