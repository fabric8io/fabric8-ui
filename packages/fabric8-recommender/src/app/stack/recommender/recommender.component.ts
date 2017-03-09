import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AddWorkFlowService } from '../stack-details/add-work-flow.service';

@Component({
    selector: 'f8-recommender',
    templateUrl: './recommender.html',
    styleUrls: ['./recommender.component.scss'],
    providers: [AddWorkFlowService]
})
/**
 * RecommenderComponent
 * implements OnChanges
 * 
 * Selector: 
 * 'f8-recommender'
 * 
 * Template:
 * recommender.html
 * 
 * Style:
 * recommender.scss
 * 
 * Functionality:
 * Handles the display of recommendations for the given package information.
 * 
 * Parent Component: 
 * StackDetailsComponent
 * 
 * Services:
 * AddWorkFlowService
 * 
 * It receives the input as an Array from the parent Component
 * 
 * The view changes based on those values.
 * 
 * 1. If there are no values at all or they are empty,
 *  'No Recommendations Scenario' is shown
 * 
 * 2. If there are recommendation,
 * They are shown as a list of items one below another 
 * with each having various actions associated with them,
 * Actions:
 *  a. Create Work Item (If the current recommendation is not dismissed, 
 *                       it is allowed for creating a work item)
 *  b. Dismiss Work Item (To make the recommendation item not creatable)
 *  c. Restore Work Item (To restore if the recommendation is already dismissed)
 * 
 * 3. Enables creation, dismissal and restoration of multiple recommendations 
 *    based on what is selected
 * 
 */
export class RecommenderComponent implements OnChanges {

    @Input() recommendations;
    private recommendationsList: Array<any> = [];

    private newRecommendations: Array<any> = [];
    private isSelectAll: boolean = false;

    private recommendationHeaderActions: Array<any> = [];

    constructor(private addWorkFlowService: AddWorkFlowService) {}

    ngOnChanges() {
        if (this.recommendations) {
            this.recommendationsList = [];
            let length: number = this.recommendations.length;
            let recommendation: any, eachOne: any;

            this.recommendationHeaderActions = [
                {
                    itemName: 'Create WorkItem',
                    identifier: 'CREATE_WORK_ITEM'
                }, {
                    itemName: 'Dismiss Recommendation',
                    identifier: 'DISMISS'
                }, {
                    itemName: 'Restore Recommendation',
                    identifier: 'RESTORE'
                }
            ];

            for (let i: number = 0; i < length; ++ i) {
                recommendation = {};
                eachOne = this.recommendations[i];
                recommendation['suggestion'] = eachOne['suggestion'];
                recommendation['action'] = eachOne['action'];
                recommendation['message'] = eachOne['message'];
                recommendation['pop'] = eachOne['pop'];

                this.recommendationsList.push(recommendation);
            }
        }
    }

    /*
     * canCreateWorkItem - takes a recommendation and returns a boolean
     * Checks if it is ok to enable creation of a work item 
     */
    private canCreateWorkItem(recommendation: any): boolean {
        return !recommendation.isDismissed;
    }

    /*
     *  handleDropDownClick - takes item, recommender, event and returns nothing
     *  Checks for which of the list item is clicked and transfers the call to 
     *  the specific function accordingly. 
     */
    public handleDropDownClick(item: any, recommender: any, event: Event): void {
        if (item) {
            let identifier: string = item.identifier;
            if (identifier === 'CREATE_WORK_ITEM') {
                if (this.canCreateWorkItem(recommender)) {
                    this.handleCreateWorkItemAction([recommender]);
                } else {
                    console.log ('Cannot create work item as it has been dismissed');
                }
            } else if (identifier === 'DISMISS') {
                if (!recommender.isDismissed) {
                    this.handleDismissWorkItemAction([recommender]);
                } else {
                    console.log ('Work item is already dismissed');
                }
            } else if (identifier === 'RESTORE') {
                if (recommender.isDismissed) {
                    this.handleRestoreWorkItemAction([recommender]);
                } else {
                    console.log ('Work item is not dismissed');
                }
            }
        }
        let currentTarget: any = event.currentTarget;
        this.hideDropDown(currentTarget.parentNode);
        event.preventDefault();
    }

    /**
     * This toggles the visibility of the drop down list.
     */
    private hideDropDown(element: Element): void {
        if (element.classList.contains('show-drop')) {
            element.classList.remove('show-drop');
        }
    }

    /**
     * Handles the click from the list item - drop down
     * 1. Create Work Item
     * 2. Dismiss
     * 3. Restore
     */
    public handleAllActionDropDownClick(item: any, event: Event): void {
        if (item) {
            let identifier: string = item.identifier;
            if (identifier === 'CREATE_WORK_ITEM') {
               this.handleMultipleWorkItemCreation(event);
            } else if (identifier === 'DISMISS') {
                this.handleDismissWorkItemAction(this.newRecommendations);
            } else if (identifier === 'RESTORE') {
                this.handleRestoreWorkItemAction(this.newRecommendations);
            }
        }
        let currentTarget: any = event.currentTarget;
        this.hideDropDown(currentTarget.parentNode);
        event.preventDefault();
    }


    /*
     *  toggleWorkItem - takes recommendations array, a boolean and returns nothing
     *  When true is passed to todo - It is Dismiss Work Item Flow,
     *  When false is passed to todo - It is Restore work item flow     
     */
    private toggleWorkItem(recommendations: Array<any>, todo: boolean): void {
        let length: number = recommendations.length;
        for (let i: number = 0; i < length; ++ i) {
            if (recommendations && recommendations.length > 0) {
                recommendations[i].isDismissed = todo;
            }
        }
    }

    /*
     *  handleDismissWorkItemAction - takes recommendations as Array and returns nothing
     *  Dismisses selected work items
     */
    private handleDismissWorkItemAction(recommendations: Array<any>): void {
        this.toggleWorkItem(recommendations, true);
    }

    /*
     *  handleRestoreWorkItemAction - takes recommendations as Array and returns nothing
     *  Restores the selected dismissed work item
     */
    private handleRestoreWorkItemAction(recommendations: Array<any>): void {
        this.toggleWorkItem(recommendations, false);
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
                    'system.state': 'new',
                    'system.title': '',
                    'system.description': ''
                },
                'relationships': {
                    'baseType': {
                        'data': {
                            'id': 'userstory',
                            'type': 'workitemtypes'
                        }
                    }
                },
                'type': 'workitems',
                'id': '55'
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
    private addWorkItems(workItems: Array<any>): void {
        let length: number = workItems.length;
        let newItem: any, workItem: any;
        newItem = this.getWorkItemData();
        for (let i: number = 0; i < length; ++ i) {
            if (workItems[i]) {
                workItem = workItems[i];
                if (newItem) {
                    newItem.data.attributes['system.title'] += workItem['title'];
                    newItem.data.attributes['system.description'] += workItem['description'];
                }
            }
        }

        let workFlow: Observable<any> = this.addWorkFlowService.addWorkFlow(newItem);
        workFlow.subscribe((data) => {
            if (data) {
                let baseUrl: string = 'http://demo.almighty.io/work-item/list/detail/' + data.data.id;
                console.log(baseUrl);
            }
        });
    }

    /*
     *  handleCreateWorkItemAction - takes recommendation and returns nothing
     *  Creates work items in specified format to be consumed for POST request 
     */
    private handleCreateWorkItemAction(recommendations: Array<any>): void {
        let workItems = [];
        let length: number = recommendations.length;
        if (recommendations && length > 0) {
            for (let i: number = 0; i < length; ++ i) {
                if (this.canCreateWorkItem(recommendations[i])) {
                    let item: any = {
                        title: recommendations[i]['action'],
                        description: recommendations[i]['message']
                    };
                    workItems.push(item);
                }
            }
            if (workItems.length > 0) {
                this.addWorkItems(workItems);
            } else {
                console.log('Work items are empty and cannot be added');
            }
        }
    }


    /*
     *  handleMultipleWorkItemCreation - takes and returns nothing
     *  handles the creation of multiple work items that are checked 
     */
    private handleMultipleWorkItemCreation(event: Event): void {
        if (this.newRecommendations.length > 0) {
            this.handleCreateWorkItemAction(this.newRecommendations);
        }
        event.preventDefault();
    }

    private handleCheckBoxChange(recommendation: any, all: boolean = false): void {
        let index: number = this.newRecommendations.indexOf(recommendation);
        if (index === -1) {
            if (recommendation.isChecked) {
                this.newRecommendations.push(recommendation);
            }
        } else {
            if (!recommendation.isChecked) {
                this.newRecommendations.splice(index, 1);
            }
        }
        if (!all) {
            this.isSelectAll = this.recommendationsList.length === this.newRecommendations.length;
        }
    }

    /*
     *  removeAllDrop simply removes the class 'show-drop' from all 
     *  the drop-down items that has show-drop class amended 
     */
    private removeAllDrop(): void {
        let showDrops: any = document.querySelectorAll('.show-drop');
        if (showDrops) {
            let length: number = showDrops.length;
            for (let i: number = 0; i < length; ++ i) {
                if (showDrops[i]) {
                    showDrops[i].classList.remove('show-drop');
                }
            }
        }
    }

    /*
        Handles Recommendation action
        1. Opens a small popup
        2. Shows various options
    */
    public handleRecommendationAction(element: HTMLElement): void {
        let sibling: Element = element.nextElementSibling;
        this.removeAllDrop();
        if (sibling) {
            sibling.classList.add('show-drop');
        }
    }

    /*
        Handles Work Item selection
        1. Toggles the selected area
     */
    public handleWorkItemSelection(event: Event, recommendation: any): void {
        let target: any = event.target;
        recommendation.isChecked = target.checked;
        this.handleCheckBoxChange(recommendation);
    }


    public handleAllItemSelection(): void {
        this.isSelectAll = !this.isSelectAll;
        this.recommendationsList.forEach(recommendation => {
            recommendation.isChecked = this.isSelectAll;
            this.handleCheckBoxChange(recommendation, true);
        });
    }

    /**
     * 'activate' - this classname gets added if any of the action items can be enabled
     *  so that user can perform the actions
     * 
     *  'deactivate' - this classname gets added if any of the action needs to be disabled.
     *  so that it is disabled for the user to perform any action
     */
     public getCurrentClass(item: any, recommendation: any): string {
        let className: string = 'deactivate';
        let identifier: string = item.identifier;

        if (identifier === 'RESTORE') {
            className = recommendation.isDismissed ? 'activate' : className;
        } else {
            className = !recommendation.isDismissed ? 'activate' : className;
        }
        return className;
    }

    /**
     * Checks if multiple work items can be created
     * returns true/false
     */
     public canCreateAllWorkItems(): boolean {
        if (this.newRecommendations.length > 0) {
            return this.newRecommendations.some(recommendation => recommendation.isDismissed === false || recommendation.isDismissed === undefined);
        }
        return false;
    }

}
