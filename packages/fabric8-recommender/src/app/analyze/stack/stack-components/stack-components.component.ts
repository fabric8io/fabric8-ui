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

    constructor() {
        this.fieldName = 'name';
        this.fieldValue = '';
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
}
