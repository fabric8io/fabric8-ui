/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs';
import { Space, Contexts } from 'ngx-fabric8-wit';
/** Vendor imports Go HERE */

import {
    MComponentInformation,
    MComponentHeaderColumn,
    MRecommendationInformation,
    MGenericStackInformation
} from '../../models/ui.model';

import { AddWorkFlowService } from '../../stack-details/add-work-flow.service';

@Component({
    selector: 'component-information',
    styleUrls: ['./component-information.component.less'],
    templateUrl: './component-information.component.html'
})
export class ComponentInformationComponent implements OnInit, OnChanges {
    @Input() component: any;
    @Input() positions: Array<MComponentHeaderColumn>;
    @Input() genericInformation: MGenericStackInformation;
    @Input() serial: number;
    @Input() type: string;
    @Input() repoInfo: any;
    public comp: MComponentInformation;
    public workItemResponse: Array<any> = [];
    public messages: any;
    private spaceName: string;
    private userName: string;

    constructor(
        private addWorkFlowService: AddWorkFlowService,
        private context: Contexts
    ) {
        if (this.context && this.context.current) {
            this.context.current.subscribe(val => {
                if (val && val.name) {
                    this.spaceName = val.name.trim().replace(' ', '_');
                }
                this.userName = val.user.attributes.username;
            });
        }
        this.messages = {
            createWorkItemEerror: 'There was a error while creating work item.',
            toastDisplay: {
                text1: 'Workitem with ID ',
                text2: ' has been added to the backlog.'
            },
            viewWorkItem: 'View Work Item'
        };
    }

    ngOnInit() {
        this.paint();
    }

    ngOnChanges(changes: SimpleChanges) {
        const summary: any = changes['component'];
        if (summary) {
            this.component = <MComponentInformation | MRecommendationInformation> summary.currentValue;
        }
        if (changes['positions']) {
            this.positions = changes['positions']['currentValue'];
        }
        this.paint();
    }

    public paint(): void {
        if (this.component) {
            if (this.type === 'recommendation') {
                let c = (<MRecommendationInformation>this.component);
                this.comp = c && c.componentInformation;
            } else {
                this.comp = <MComponentInformation>this.component;
            }
        }
    }

    public handleAction(event: MouseEvent, comp: MComponentInformation) {
        event.preventDefault();
        const workItems = [];
        let message = '';
        const codebase = {
            'repository': '',
            'branch': '',
            'filename': this.component['manifestFilePath'],
            'linenumber': 1
        };
        let key = '';

        // TODO form data to be shared with recommender object
        let titleHdr = '';
        if (comp && comp.recommendation) {
            message = `Stack analysis has identified alternate component
            for **${comp.name}**.
            You have chosen to replace **${comp.name}** with **${comp.recommendation.componentInformation.name}**
            and version: **${comp.recommendation.componentInformation.currentVersion}** in your application stack`;
            titleHdr = `Alternate dependencies for ${comp.name}`;
            key = comp.recommendation.componentInformation.name;
        } else if (comp && !comp.hasSecurityIssue && !comp.recommendation) {
            message = `Stack analysis has identified some additional dependencies for your
            application stack. You have chosen to add **${comp.name}**
            with **${comp.currentVersion}** to your application stack`;
            titleHdr = `Add ${comp.name} to your application stack`;
            key = comp.name;
        } else if (comp && comp.hasSecurityIssue) {
            message = `Stack analysis has identified some security issues for dependency **${comp.name}**
            with **${comp.currentVersion}** in your application stack. CVE id for the highest security
             issue is **${comp.securityDetails.highestIssue.cve}**`;
            titleHdr = `${comp.name} has some security issues`;
            key = comp.name;
        }
        if (this.repoInfo && this.repoInfo.git) {
            codebase['repository'] = this.repoInfo.git.uri || '';
            codebase['branch'] = this.repoInfo.git.ref || 'master';
        }
        message += ' \n\n ';
        message += '\n\n **Repository:** ' + codebase['repository'];
        message += '\n\n **Branch:** ' + codebase['branch'];
        message += '\n\n **Filename:** ' + codebase['filename'];
        message += '\n\n **Line Number:**' + codebase['linenumber'];
        const item: any = {
            title: titleHdr,
            description: {
                content: message,
                markup: 'Markdown'
            },
            codebase: codebase,
            key: key
        };

        workItems.push(item);

        if (workItems.length > 0) {
            this.addWorkItems(workItems[0], comp);
        } else {
            console.log('Work items are empty and cannot be added');
        }
    }

    /*
     *  getWorkItemData - Takes nothing, returns Object
     *  It returns the predefined JSON structure to be sent as an input
     *  for work item creation request.
     */
    private getWorkItemData(): any {
        const workItemData = {
            'data': {
                'attributes': {
                    'system.title': '',
                    'system.codebase': ''
                },
                'type': 'workitems',
                'relationships': {
                    'baseType': {
                        'data': {
                            'id': '',
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
    private addWorkItems(workItem: Array<any>, comp: MComponentInformation): void {
        let newItem: any; // , workItem: any;
        newItem = this.getWorkItemData();
        // for (let i: number = 0; i < length; ++i) {
            // if (workItems[i]) {
                // workItem = workItems[i];
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
        // }

        let workFlow: Observable<any> = this.addWorkFlowService.addWorkFlow(newItem);
        workFlow.subscribe((data) => {
            if (data) {
                let inputUrlArr: Array<string> = [];
                if (data.links && data.links.self && data.links.self.length &&
                    data.data.attributes) {
                    comp.workItem.isWorkItemCreated = true;
                    inputUrlArr = data.links.self.split('/api/');
                    const hostString = inputUrlArr[0] ? inputUrlArr[0].replace('api.', '') : '';
                    const baseUrl: string = hostString +
                        `/${this.userName}/${this.getSpaceName(this.spaceName)}/plan/detail/` +
                        data.data.attributes['system.number'];
                    comp.workItem.url = baseUrl;
                    this.displayWorkItemResponse(baseUrl, data.data.attributes['system.number']);
                    newItem.url = baseUrl;
                    // TODO :: toggle Worke item link and toast notification
                    // this.toggleWorkItemButton(newItem);
                }
            }
        });
    }

    private getSpaceName(spaceName: string) {
        spaceName = spaceName.replace(/\s/g, '_');
        return spaceName;
    }

    /**
     * displayWorkItemResponse - takes a message string and returns nothing
     * Displays the response received from the creation of work items
     */
    private displayWorkItemResponse(url: string, id: any): void {
        const notification = {
            iconClass: '',
            alertClass: '',
            text: null,
            link: null,
            linkText: this.messages.viewWorkItem
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
            notification.text = this.messages.createWorkItemEerror;
        }
        this.workItemResponse.push(notification);
    }
}
