import {
    Component,
    Input,
    OnChanges
} from '@angular/core';
import { GlobalConstants } from '../constants/constants.service';

@Component({
    selector: 'f8-stack-components',
    templateUrl: './stack-components.component.html',
    styleUrls: ['./stack-components.component.scss']
})

/**
 * StackComponents
 * implements OnChanges
 * 
 * Selector: 
 * 'f8-stack-components'
 * 
 * Template:
 * stack-components.html
 * 
 * Style:
 * stack-components.scss
 * 
 * Functionality:
 * Handles the display of dependant packages/units for the given package information.
 * 
 * Parent Component: 
 * StackDetailsComponent
 * 
 * Pipes:
 * table-orderby.pipe.ts
 * table-filter.pipe.ts
 * 
 * Features:
 * 1. Column Sorting
 * 2. Table Filtering
 * 
 * It receives the input as an Array from the parent Component
 * 
 * The view changes based on those values.
 * 
 * Dynamically updates the table entries on filtering or on sorting.
 * 
 */
export class StackComponents implements OnChanges {

    @Input() dependencies;
    public messages: any;
    public sortDirectionClass: string = this.angleDown;
    private dependenciesList: Array<any> = [];
    private headers: Array<any> = [];
    private keys: any = [];

    private fieldName: string;
    private fieldValue: string;

    private filters: Array<any> = [];
    private currentFilter: string = '';

    private orderByName: string = '';
    private direction: string = '';
    private angleUp: string = 'fa-angle-up';
    private angleDown: string = 'fa-angle-down';

    constructor(private constants: GlobalConstants) {
        this.constants.getMessages('stackComponents').subscribe((message) => {
            this.messages = message;
        });
        this.fieldName = 'name';
        this.fieldValue = '';

        this.orderByName = 'enterpriseUsage';
        this.direction = 'down';

        this.filters = [{
            name: 'Name',
            identifier: 'name'
        }, {
            name: 'Current Version',
            identifier: 'curVersion'
        }, {
            name: 'Enterprise Usage',
            identifier: 'enterpriseUsage'
        }];

        this.currentFilter = this.filters[0].name;


        this.keys = {
            name: 'name',
            currentVersion: 'curVersion',
            latestVersion: 'latestVersion',
            dateAdded: 'dateAdded',
            publicPopularity: 'pubPopularity',
            enterpriseUsage: 'enterpriseUsage',
            teamUsage: 'teamUsage'
        };
    }

    ngOnChanges() {
        if (this.dependencies) {
            this.handleDependencies(this.dependencies);
        }
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

    private handleDependencies(dependencies: Array<any>): void {
        if (dependencies) {
            let length: number = dependencies.length;
            let dependency: any, eachOne: any;
            this.headers = [
                {
                    name: 'Name',
                    identifier: this.keys['name'],
                    isSortable: true
                }, {
                    name: 'Current Version',
                    identifier: this.keys['currentVersion'],
                    isSortable: true
                }, {
                    name: 'Latest Version',
                    identifier: this.keys['latestVersion']
                }, {
                    name: 'Public Popularity',
                    identifier: this.keys['publicPopularity']
                }, {
                    name: 'Enterprise Usage',
                    identifier: this.keys['enterpriseUsage'],
                    isSortable: true
                }
            ];

            this.dependenciesList = [];
            for (let i: number = 0; i < length; ++ i) {
                dependency = {};
                eachOne = dependencies[i];
                dependency[this.keys['name']] = eachOne['name'];
                dependency[this.keys['currentVersion']] = eachOne['version'];
                dependency[this.keys['latestVersion']] = eachOne['latest_version'] || 'NA';
                dependency[this.keys['publicPopularity']] =
                  eachOne['github_details'] ? (eachOne['github_details'].stargazers_count === -1? 'NA' : eachOne['github_details'].stargazers_count) : 'NA';
                dependency[this.keys['enterpriseUsage']] = eachOne['enterpriseUsage'] || 'NA';

                this.dependenciesList.push(dependency);
            }
        }
    }
}
