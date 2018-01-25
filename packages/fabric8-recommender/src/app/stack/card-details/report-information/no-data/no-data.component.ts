/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
/** Vendor imports Go HERE */

@Component({
    selector: 'no-data',
    styleUrls: ['./no-data.component.less'],
    templateUrl: './no-data.component.html'
})
export class NoDataComponent implements OnChanges {
    @Input() identifier: string;

    public title: string = '';
    public description: string = '';

    private TITLE_AND_DESCRIPTION: any = {
        'security': {
            title: 'No security issues',
            description: 'OSIO Analytics has not identified any security issues affecting the dependencies of this stack.'
        },
        'ins-usage': {
            title: 'No usage outliers',
            description: 'OSIO Analytics has not identified any usage outliers and has no suggestions for alternate dependencies for this stack.'
        },
        'lic-conflicts': {
            title: 'No license conflicts',
            description: 'OSIO Analytics could not find any conflicting licences in this stack'
        },
        'comp-analyzed': {
            title: 'No analyzed dependencies',
            description: 'OSIO Analytics was unable to analyze any dependencies for this stack'
        },
        'ins-companion': {
            title: 'No companion dependencies',
            description: 'OSIO Analytics has no suggestions for companion dependencies for this stack.'
        },
        'lic-unknown': {
            title: 'No unknown licenses',
            description: 'OSIO Analytics could not find any unknown licences in this stack'
        },
        'comp-unknown': {
            title: 'No unknown dependencies',
            description: 'OSIO Analytics has analyzed all the dependencies in this stack'
        },
    };

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['identifier'];
        if (summary && summary['currentValue']) {
            this.identifier = <string>summary['currentValue'];
            this.paint();
        }
    }

    private paint() {
        if (this.identifier) {
            let configObject: any = this.TITLE_AND_DESCRIPTION[this.identifier];
            if (configObject) {
                this.title = configObject.title;
                this.description = configObject.description;
            }
        }
    }
}
