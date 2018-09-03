/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
/** Vendor imports Go HERE */

import {
    MComponentInformation
} from '../../../models/ui.model';

@Component({
    selector: 'component-snippet',
    styleUrls: ['./component-snippet.component.less'],
    templateUrl: './component-snippet.component.html'
})
export class ComponentSnippetComponent implements OnInit, OnChanges {
    @Input() component: MComponentInformation;
    @Input() view: string;

    public githubEntries: Array<any> = [];

    public githubKeys: any = {
        contributors: 'Contributors',
        forks: 'Forks',
        depRepos: 'Dependent Repos',
        stars: 'Stars',
        usage: 'Usage'
    };

    public osioKeys: any = {
        usage: 'Usage'
    };

    public showOSIOUsage: boolean = false;

    ngOnInit() {
        this.paint();
    }

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['component'];
        if (summary) {
            this.component = <MComponentInformation> summary.currentValue;
        }
        this.paint();
    }

    private paint(): void {
        this.githubEntries = [];
        if (this.component) {
            if (this.component.github) {
                let github = this.component.github;
                let value = '';
                for (let key in github) {
                    if (key === 'users') continue;
                    if (github.hasOwnProperty(key)) {
                        value = github[key];
                        value = value && value.toString() === '-1' ? 'NA' : value;
                        this.githubEntries.push({ key: this.githubKeys[key], value: value });
                    }
                }
            }
        }
    }
}
