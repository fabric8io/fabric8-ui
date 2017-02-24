import { Component, Input } from '@angular/core';

@Component({
    selector: 'f8-stack-components',
    templateUrl: './stack-components.html',
    styleUrls: ['./stack-components.scss']
})
export class StackComponents {

    @Input() dependencies;
    private dependenciesList: Array<any> = [];

    private fieldName: string;
    private fieldValue: string;

    private filters: Array<any> = [];
    private currentFilter: string = '';

    constructor() {
        this.fieldName = 'name';
        this.fieldValue = '';

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
    }

    ngOnInit() {
        if (this.dependencies) {
            let length: number = this.dependencies.length;
            let dependency: any, eachOne: any;
            for (let i: number = 0; i < length; ++ i) {
                dependency = {};
                eachOne = this.dependencies[i];
                dependency['name'] = eachOne['name'];
                dependency['curVersion'] = eachOne['curVersion'];
                dependency['latestVersion'] = eachOne['latestVersion'];
                dependency['dateAdded'] = eachOne['dateAdded'];
                dependency['pubPopularity'] = eachOne['pubPopularity'];
                dependency['enterpriseUsage'] = eachOne['enterpriseUsage'];
                dependency['teamUsage'] = eachOne['teamUsage'];

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
}
