import { Component, Input } from '@angular/core';

@Component({
    selector: 'f8-stack-components',
    templateUrl: './stack-components.html',
    styleUrls: ['./stack-components.scss']
})
export class StackComponents {

    @Input() dependencies;
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
    private sortDirectionClass: string = this.angleDown;

    constructor() {
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

    ngOnInit() {
        if (this.dependencies) {
            let length: number = this.dependencies.length;
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
                    name: 'Date Added',
                    identifier: this.keys['dateAdded']
                }, {
                    name: 'Public Popularity',
                    identifier: this.keys['publicPopularity']
                }, {
                    name: 'Enterprise Usage',
                    identifier: this.keys['enterpriseUsage'],
                    isSortable: true
                }, {
                    name: 'Team Usage',
                    identifier: this.keys['teamUsage']
                }
            ];

            for (let i: number = 0; i < length; ++ i) {
                dependency = {};
                eachOne = this.dependencies[i];
                dependency[this.keys['name']] = eachOne['name'];
                dependency[this.keys['currentVersion']] = eachOne['curVersion'];
                dependency[this.keys['latestVersion']] = eachOne['latestVersion'];
                dependency[this.keys['dateAdded']] = eachOne['dateAdded'];
                dependency[this.keys['publicPopularity']] = eachOne['pubPopularity'];
                dependency[this.keys['enterpriseUsage']] = eachOne['enterpriseUsage'];
                dependency[this.keys['teamUsage']] = eachOne['teamUsage'];

                this.dependenciesList.push(dependency);
            }
        }
    }

    private handleKeyUpEvent(event: Event): void {
        let target: any = event.target;
        this.fieldValue = target.value;
    }

    private handleDropDownClick(element: Element): void {
        if (element.classList.contains('open')) {
            element.classList.remove('open');
        } else {
            element.classList.add('open');
        }
    }

    private handleFilterFieldClick(element: Element, field: any, event: Event): void {
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

    private handleTableOrderClick(header: any): void {
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
}
